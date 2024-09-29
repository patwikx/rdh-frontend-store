"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import getOrderDetails from "@/actions/get-order-details";
import { Order } from "@/types";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { ErrorAnimation } from "@/components/ui/error";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, TruckIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function OrderDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create a ref for the card to be printed
  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = window.location.pathname.split("/").pop();
      if (orderId) {
        try {
          const fetchedOrderDetails = await getOrderDetails(orderId);
          setOrderDetails(fetchedOrderDetails);
        } catch (err) {
          const errorMessage = (err as Error).message;
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open("", "_blank");
        const printClone = printContent.cloneNode(true) as HTMLDivElement;

        // Remove buttons from the cloned content
        const buttons = printClone.querySelectorAll<HTMLButtonElement>("button");
        buttons.forEach((button) => button.remove());

        const totalAmount = orderDetails?.orderItems.reduce((sum, item) => sum + item.totalItemAmount, 0);

        printWindow?.document.write(`
<html>
  <head>
    <title>Invoice - Order Details</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        background-color: #f9f9f9; 
        color: #333; 
      }
      .card {
        padding: 20px;
        background-color: #fff; 
        border-radius: 8px; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
      }
      .invoice-header {
        text-align: center; 
        margin-bottom: 20px; 
      }
      .invoice-title {
        font-size: 24px; 
        font-weight: bold; 
        color: #4a90e2; 
      }
      .invoice-details {
        margin: 10px 0; 
        font-size: 14px; 
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px; 
      }
      .table th, .table td {
        border: 1px solid #ddd;
        padding: 12px; 
        text-align: left; 
      }
      .table th {
        background-color: #4a90e2; 
        color: white; 
      }
      .table tr:nth-child(even) {
        background-color: #f2f2f2; 
      }
      .total-amount {
        margin-top: 20px; 
        font-size: 18px; 
        font-weight: bold; 
        color: #4a90e2; 
        text-align: right; 
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="invoice-header">
        <div class="invoice-title">Order Details</div>
        <div class="invoice-details">
          <p><strong>Company Name:</strong> ${orderDetails?.companyName}</p>
          <p><strong>PO Number:</strong> ${orderDetails?.poNumber}</p>
    
          <p><strong>Contact:</strong> ${orderDetails?.contactNumber}</p>
          <p><strong>Address:</strong> ${orderDetails?.address}</p>
        </div>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails?.orderItems.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td style="text-align: right;">
                  ${new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  }).format(parseFloat(item.product.price))}
                </td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">
                  ${new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  }).format(item.totalItemAmount)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
<div class="total-amount">
    Total Amount: ${new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalAmount || 0)}
  </div>
    </div>
  </body>
</html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
        printWindow?.close();
    }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <ErrorAnimation />;
  }

  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

  const handleBackClick = () => {
    router.push("/my-orders");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-start mb-4">
        <Button className="flex items-center" onClick={handleBackClick}>
          <ArrowLeft className="mr-2" />
          Back to previous page.
        </Button>
      </div>
      <Card className="bg-white shadow-md rounded-lg p-4" ref={printRef}>
        <CardContent>
          <div className="flex justify-between items-start">
            <div className="mt-2">
              <Label className="font-bold text-xl">Order Details</Label>
              <div className="mt-2">
                <Label className="text-md font-black">{orderDetails.companyName}</Label>
                <CardDescription>{orderDetails.poNumber}</CardDescription>
                <CardDescription>{orderDetails.address}</CardDescription>
                <CardDescription>{orderDetails.contactNumber}</CardDescription>
                <CardDescription>
                  {new Date(orderDetails.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => {/* Your tracking logic here */}} className="flex items-center">
                <TruckIcon className="w-4 h-4" /> 
                <p className="text-sm font-sans ml-1">Track Order</p>
              </Button>
              <Button size="sm" onClick={handlePrint} className="flex items-center">
                <Printer className="w-4 h-4" /> 
                <p className="text-sm font-sans ml-1">Print</p>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <Card>
              <CardContent className="p-0">
                <Table className="w-full bg-white rounded-lg shadow-md">
                  <TableHeader>
                    <TableRow className="bg-gray-100 text-gray-700">
                      <TableHead className="py-3 px-4 text-left">Item</TableHead>
                      <TableHead className="py-3 px-4 text-left">Price</TableHead>
                      <TableHead className="py-3 px-4 text-left">Qty</TableHead>
                      <TableHead className="py-3 px-4 text-left">Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.orderItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50 transition duration-200 ease-in-out">
                        <TableCell className="py-3 px-4 flex items-center">
                          {item.product.name}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(parseFloat(item.product.price))}
                        </TableCell>
                        <TableCell className="py-3 px-4">{item.quantity}</TableCell>
                        <TableCell className="py-3 px-4">
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(item.totalItemAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <p className="font-bold">
              Total Amount: {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(orderDetails.orderItems.reduce((sum, item) => sum + item.totalItemAmount, 0))}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
