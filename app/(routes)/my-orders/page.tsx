"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // NextAuth for authentication
import getMyOrders from "@/actions/get-my-orders"; // Your action for fetching orders
import { Order, OrderItem } from "@/types"; // Adjust based on your file structure
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { ErrorAnimation } from "@/components/ui/error";
import { useRouter } from "next/navigation";


export default function DataTableDemo() {
  const { data: session } = useSession(); // Get the user session
  const router = useRouter(); // Call useRouter here
  const [orders, setOrders] = useState<Order[]>([]); // State to hold the orders
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch orders based on session email
  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.email) {
        try {
          const fetchedOrders = await getMyOrders(session.user.email);
          setOrders(fetchedOrders); // Set the orders in state
        } catch (err) {
          const errorMessage = (err as Error).message; // Cast to Error for better typing
          setError(errorMessage); // Set the error message
        } finally {
          setLoading(false); // Set loading to false
        }
      }
    };

    fetchOrders();
  }, [session]);

  // Define your columns inside the component
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "poNumber",
      header: "PO #",
      cell: ({ row }) => <div>{row.getValue("poNumber")}</div>,
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("companyName")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "clientEmail",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("clientEmail")}</div>
      ),
    },
    {
      accessorKey: "orderItems",
      header: "Total Amount",
      cell: ({ row }) => {
        const orderItems = row.getValue("orderItems") as OrderItem[]; // Type assertion
        const totalAmount =
          orderItems.length > 0
            ? orderItems.reduce((sum, item) => sum + item.totalItemAmount, 0)
            : 0;

        // Format totalAmount with commas and decimals
        const formattedAmount = new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalAmount);

        return <div className="font-bold">{formattedAmount}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Order date",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string; // Ensure it's a string
        const date = new Date(dateStr); // Convert to Date object
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long", // e.g., "September"
          day: "numeric", // e.g., "29"
          hour12: true, // Use 12-hour format (AM/PM)
        });
        return <div className="capitalize">{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/my-orders/${order.id}`)}
              >
                View order details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <CardTitle className="mt-4 ml-4 font-bold text-3xl">
        My Orders ({orders.length})
      </CardTitle>
      <Card className="mt-4 ml-4 mr-4 mb-4 bg-white shadow-md rounded-lg">
        <CardContent>
          {loading ? ( // Show loading state
            <div className="flex justify-center items-center py-4">
              <Loader />
            </div>
          ) : error ? ( // Show error if any
            <div>
              <ErrorAnimation />
            </div>
          ) : (
            <>
              <div className="flex items-center py-4">
                <Input
                  placeholder="Filter orders..."
                  value={
                    (table.getColumn("poNumber")?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table.getColumn("poNumber")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto flex items-center">
                      Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="bg-gray-100">
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id} className="text-gray-700">
                              {header.isPlaceholder
                                ? null
                                : (
                                  <div className="flex items-center">
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    <CaretSortIcon
                                      className="ml-2 h-4 w-4 cursor-pointer"
                                      onClick={header.column.getToggleSortingHandler()}
                                    />
                                  </div>
                                )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="p-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
      
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
          
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}