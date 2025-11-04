"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { PurchaseOrder } from "@shared/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
const statusConfig = {
  'Pending': 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  'Shipped': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  'Delivered': 'bg-green-400/20 text-green-300 border-green-400/30',
  'Cancelled': 'bg-red-400/20 text-red-300 border-red-400/30',
}
export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Supplier
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => format(new Date(row.getValue("orderDate")), "PPP"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusConfig
      return <Badge variant="outline" className={cn("font-semibold", statusConfig[status])}>{status}</Badge>
    },
  },
  {
    accessorKey: "totalValue",
    header: () => <div className="text-right">Total Value</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalValue"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Order Details</DropdownMenuItem>
            <DropdownMenuItem>Mark as Shipped</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]