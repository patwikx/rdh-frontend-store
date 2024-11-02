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
      accessorKey: "orderItems",
      header: "Total Amount",
      cell: ({ row }) => {
        const orderItems = row.getValue("orderItems") as OrderItem[]
        const totalAmount =
          orderItems.length > 0
            ? orderItems.reduce((sum, item) => sum + item.totalItemAmount, 0)
            : 0

        const formattedAmount = new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalAmount)

        return <div className="font-bold text-center">{formattedAmount}</div>
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
            <span
              className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                status ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {status ? "Completed" : "Processing"}
            </span>
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

  return (
    <div>
      <CardTitle className="mt-4 ml-4 font-bold text-3xl">
        My Orders ({orders.length})
      </CardTitle>
      <Card className="mt-4 ml-4 mr-4 mb-4 bg-white shadow-md rounded-lg">
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader />
            </div>
          ) : error ? (
            <div>
              <ErrorAnimation />
            </div>
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
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="p-4 text-center">
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
  )
}