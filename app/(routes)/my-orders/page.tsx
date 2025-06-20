"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
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
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import getMyOrders from "@/actions/get-my-orders"
import { Order, OrderItem } from "@/types"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { ErrorAnimation } from "@/components/ui/error"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart } from "lucide-react"

export default function DataTableDemo() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.email) {
        try {
          const fetchedOrders = await getMyOrders(session.user.email)
          setOrders(fetchedOrders)
        } catch (err) {
          const errorMessage = (err as Error).message
          setError(errorMessage)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchOrders()
  }, [session])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "poNumber",
      header: "PO #",
      cell: ({ row }) => <div className="text-center whitespace-nowrap">{row.getValue("poNumber")}</div>,
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <div className="capitalize text-center whitespace-nowrap">{row.getValue("companyName")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "contactNumber",
      header: "Contact #",
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("contactNumber")}</div>
      ),
    },
    {
      accessorKey: "clientEmail",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase text-center">{row.getValue("clientEmail")}</div>
      ),
    },
    {
      accessorKey: "totalAmountItemAndShipping",
      header: "Total Amount",
      cell: ({ row }) => {
        const totalAmountItemAndShipping = row.getValue("totalAmountItemAndShipping") as number;
    
        const formattedAmount = new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalAmountItemAndShipping);
    
        return <div className="font-bold text-center">{formattedAmount}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Order date",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string
        const date = new Date(dateStr)
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour12: true,
        })
        return <div className="capitalize text-center whitespace-nowrap">{formattedDate}</div>
      },
    },
    {
      accessorKey: "orderStatus",
      header: "Order Status",
      cell: ({ row }) => {
        const status = row.getValue("orderStatus") as boolean
        return (
          <div className="flex justify-center">
            <Badge
              variant={status ? "default" : "secondary"}
              className={`${
                status 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              {status ? "Completed" : "Processing"}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "deliveryMethod",
      header: "Delivery Method",
      cell: ({ row }) => <div className="text-center">{row.getValue("deliveryMethod")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex justify-center">
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
          </div>
        )
      },
    },
  ]

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
  })

  // No Orders Empty State Component
  const NoOrdersState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-blue-500" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        You haven&apos;t placed any orders yet. When you do, they&apos;ll appear here for you to track and manage.
      </p>
      
      <Button 
        onClick={() => router.push('/')} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
      >
        Start Shopping
      </Button>
    </div>
  )

  return (
    <div>
      <CardTitle className="mt-4 ml-4 font-bold text-3xl">
        My Orders ({orders.length})
      </CardTitle>
      <Card className="mt-4 ml-4 mr-4 mb-4 bg-white shadow-md rounded-lg">
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : error ? (
            <div>
              <ErrorAnimation />
            </div>
          ) : orders.length === 0 ? (
            <NoOrdersState />
          ) : (
            <>
              <div className="flex items-center py-4">
                <Input
                  placeholder="Filter orders..."
                  value={(table.getColumn("poNumber")?.getFilterValue() as string) ?? ""}
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
                        )
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
                            <TableHead key={header.id} className="text-gray-700 text-center">
                              {header.isPlaceholder
                                ? null
                                : (
                                  <div className="flex items-center justify-center">
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
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="p-4 text-center">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
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
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
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
  )
}