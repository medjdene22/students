"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { TestAction } from "./test-action"
import { InferResponseType } from "hono/client"
import { client } from "@/lib/hono"

type Test = InferResponseType<typeof client.api.test[':teacherAssignmentId']["$get"], 200>['tests'][0]

export const columns: ColumnDef<Test>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Test Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.name}</span>
    )
  },
  
  {
    accessorKey: "testDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline">
        {format(new Date(row.original.testDate), 'PPP')}
      </Badge>
    )
  },  
  {
    accessorKey: "replacementDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Replacement Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {

      const replacementDate = row.original.replacementDate; 

      return (
      <Badge variant="outline">
        {!!replacementDate && format(new Date(replacementDate), 'PPP')}
        {!replacementDate && "no replacement "}

      </Badge>
      )
    }
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
      const test = row.original;

      return (
        <TestAction 
          testId={test.id} 
          testName={test.name}
          testDate={test.testDate}
          replacementDate={test.replacementDate}
        >
          <Button variant='ghost' className="size-8 p-0">
              <MoreHorizontal className='size-4'/>
          </Button>
        </TestAction>
      )
    }
  }
]
