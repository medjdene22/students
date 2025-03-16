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
type ResponseType = InferResponseType<typeof client.api.student['group'][':id']['$get'], 200>['students'][0]


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
              Student name
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
    accessorKey: "username",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Matricule
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.username}</span>
    )
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.email}</span>
    )
  },
  
  {
    accessorKey: "groupName",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              group
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.groupName}</span>
    )
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.id;

        return (

          
        <Action id={id}>
                <Button variant='ghost' className="size-8 p-0">
                    <MoreHorizontal className='size-4'/>
                </Button>
        </Action>
        )
    }
  }
]