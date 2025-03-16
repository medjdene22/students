"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { client } from "@/lib/hono"
import { InferResponseType } from "hono"
import { Action } from "./action"
import { Badge } from "@/components/ui/badge"
import TeacherAvatar from "./teacher-avatar"

// Define the type based on the API response
type ResponseType = InferResponseType<typeof client.api.teacher.$get, 200>['teachers'][0]

// Function to format grade display
const formatGrade = (grade: string) => {
  switch (grade) {
    case "mcb": return "MCB";
    case "mca": return "MCA";
    case "professor": return "Professor";
    case "substitute": return "Substitute";
    default: return grade;
  }
}

// Function to get grade badge variant
const getGradeVariant = (grade: string) => {
  switch (grade) {
    case "mcb": return "outline";
    case "mca": return "secondary";
    case "professor": return "default";
    case "substitute": return "destructive";
    default: return "outline";
  }
}

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
              Teacher name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <TeacherAvatar name={row.original.name} grade={row.original.grade} classname="size-8" />
        <span className="font-medium">{row.original.name}</span>
      </div>
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
              Username
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
    accessorKey: "grade",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Grade
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">
        <Badge variant={getGradeVariant(row.original.grade)}>
          {formatGrade(row.original.grade)}
        </Badge>
      </span>
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