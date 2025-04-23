"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { SpecialtyAction } from "./specialty-action"
import { InferResponseType } from "hono/client"
import { client } from "@/lib/hono"

// Define the type for specialty data
type ResponseType = InferResponseType<typeof client.api.subject[":id"]["specialties"]['$get'], 200>['specialtySubjects'][0]


export const specialtiesColumns: ColumnDef<ResponseType>[] = [
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
    accessorKey: "specialtyName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Specialty Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.specialtyName}</span>
    )
  },
  
  {
    accessorKey: "specialtyYear",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => (
      <span className="font-medium">{row.original.specialtyYear}</span>
    )
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.specialtySubjectId;

        return (
        <SpecialtyAction id={id}>
                <Button variant='ghost' className="size-8 p-0">
                    <MoreHorizontal className='size-4'/>
                </Button>
        </SpecialtyAction>
        )
    }
  }
]