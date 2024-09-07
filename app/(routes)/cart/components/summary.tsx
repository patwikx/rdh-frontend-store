"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Buttons from "@/components/ui/Button";
import Currency from "@/components/ui/currency";
import { toast } from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import { Loader } from "@/components/ui/loader";

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    // State to manage loading animation
    const [loading, setLoading] = useState(false);

    // State for delivery information
    const [companyName, setCompanyName] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Order completed.");
            removeAll();
        }

        if (searchParams.get("canceled")) {
            toast.error("Something went wrong.");
        }
    }, [searchParams, removeAll]);

    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
    }, 0);

    const onCheckout = async () => {
        if (items.length === 0) {
            toast.error("No items in the cart.");
            return;
        }
    
        if (!companyName || !poNumber || !address || !contactNumber) {
            toast.error("Please fill in all the delivery information fields.");
            return;
        }
    
        // Ensure all items have a valid quantity
        const missingQuantities = items.some(item => !item.quantity || item.quantity <= 0);
        if (missingQuantities) {
            toast.error("Quantities must be provided for all product IDs.");
            return;
        }
    
        setLoading(true); // Start loading animation
    
        try {
            // Create an array of order items with totalItemAmount included
            const orderItems = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                totalItemAmount: Number(item.price) * item.quantity // Calculate total amount for each item
            }));
    
            // Send orderItems and delivery information to the backend
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                orderItems, // Include totalItemAmount
                companyName,
                poNumber,
                address,
                contactNumber,
            });
    
            if (response.status === 201) {
                toast.success("Order created successfully! Redirecting...");
                removeAll();
                setTimeout(() => {
                    window.location.href = response.data.redirectUrl || "/";
                }, 500); // Delay in milliseconds
            } else {
                toast.error("Checkout failed. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("There was an error processing your order.");
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
                <ul className="list-disc ml-5">
                    {items.map((item) => (
                        <li key={item.id} className="text-sm text-gray-700">
                            <div className="flex flex-row">
                                <span>{item.name}</span>
                                <span className="ml-4"> ({item.quantity})</span>
                                <div className="flex flex-row ml-auto items-end">
                                    <Currency value={Number(item.price) * item.quantity} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">Order total</div>
                    <Currency value={totalPrice} />
                </div>
            </div>

            <div className="mt-6">
                <label className="mt-6 font-bold text-xl text-black">
                    Delivery Information
                </label>
            </div>
            <div className="mt-2 space-y-4">
                <label className="block">
                    <span className="text-gray-700">Company Name</span>
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">PO #</span>
                    <input
                        type="text"
                        placeholder="PO #"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Address</span>
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Contact Number</span>
                    <input
                        type="text"
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </label>
            </div>

            {loading ? (
                <div className="flex items-center justify-center mt-6">
                    <Loader />
                </div>
            ) : (
                <Buttons onClick={onCheckout} className="w-full mt-6">
                    Checkout
                </Buttons>
            )}
        </div>
    );
};

export default Summary;