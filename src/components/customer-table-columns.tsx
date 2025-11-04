"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Customer } from "@shared/types"
import { cn } from "@/lib/utils"
const loyaltyTierConfig = {
  'VIP': 'bg-gold text-charcoal border-gold/50',
  'Gold': 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  'Silver': 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  'Bronze': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
}
export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "loyaltyTier",
    header: "Loyalty Tier",
    cell: ({ row }) => {
      const tier = row.getValue("loyaltyTier") as keyof typeof loyaltyTierConfig
      return (
        <Badge variant="outline" className={cn("font-semibold", loyaltyTierConfig[tier])}>
          {tier}
        </Badge>
      )
    },
  },
  {
    accessorKey: "purchaseHistory",
    header: () => <div className="text-center">Total Purchases</div>,
    cell: ({ row }) => {
      const purchases = row.getValue("purchaseHistory") as string[]
      return <div className="text-center font-medium">{purchases.length}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original
      return (
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.id)}
              >
                Copy customer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment history</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]