"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ExternalLinkIcon, MoreHorizontal } from "lucide-react"
import { InferResponseType } from "hono/client"
import { client } from "@/lib/hono"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReactNode } from "react"
import { useRouter } from 'next/navigation'

// Define the type for subject data in specialty context
type ResponseType = InferResponseType<typeof client.api.teacherUser.subjects.$get, 200>["subjects"][0]

export const subjectsColumns: ColumnDef<ResponseType>[] = [
  
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
      <span className="font-medium pl-4">{row.original.year}</span>
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


const SubjectAction = ({id, children}: {id: number, children: ReactNode}) => {

  const router = useRouter();

  const handleOpen = () => {
    router.push(`/dashboard/subject/${id}`);
  }
 

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          
          <DropdownMenuItem 
            onClick={handleOpen}
            className='p-2.5   font-medium'
          >
            <ExternalLinkIcon className='size-4 mr-1'/> Open subject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
    </div>
  );
};