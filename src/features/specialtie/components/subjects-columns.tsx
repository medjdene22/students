"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { SubjectAction } from "./subject-action"
import { InferResponseType } from "hono/client"
import { client } from "@/lib/hono"

// Define the type for subject data in specialty context
type ResponseType = InferResponseType<typeof client.api.specialtie[':id']["subjects"]['$get'], 200>['subjectSpecialties'][0]


export const subjectsColumns: ColumnDef<ResponseType>[] = [
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
    accessorKey: "subjectName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Subject Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.subjectName}</span>
    )
  },
  
  {
    accessorKey: "year",
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
      <span className="font-medium">{row.original.year}</span>
    )
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.specialtySubjectId;

        return (
        <SubjectAction id={id}>
                <Button variant='ghost' className="size-8 p-0">
                    <MoreHorizontal className='size-4'/>
                </Button>
        </SubjectAction>
        )
    }
  }
]