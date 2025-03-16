"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { client } from "@/lib/hono"
import { InferResponseType } from "hono"
import { Action } from "./action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type ResponseType = InferResponseType<typeof client.api.group['specialty'][':specialtyId']['$get'], 200>['groups'][0]


export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Group name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>

    
          </div>
          
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.name}</span>
    )
  },

  {
    accessorKey: "section",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Section
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.section}</span>
    )
  },

  {
    accessorKey: "year",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Year
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.year}</span>
    )
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.id;

        return (

          
        <Action id={id} specialtyId={row.original.specialtyId}>
                <Button variant='ghost' className="size-8 p-0">
                    <MoreHorizontal className='size-4'/>
                </Button>
        </Action>
        )
    }
  }
]