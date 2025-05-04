'use client'
import { Card, CardContent, CardDescription, CardHeader ,CardTitle } from "@/components/ui/card";
import { useGetTeacherSubject } from "../api/use-get-subject";
import { useTeacherSubjectId } from "../hooks/use-teacher-subject-id";
import {  MoreHorizontal, ArrowUpDown , ExternalLinkIcon} from "lucide-react";
import { useGetTeacherGroups } from "../api/use-get-groups";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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

export function SubjectComponent() {

    const teacherSubjectId = useTeacherSubjectId()
    const { data: subject, isLoading: isLoadingSubjects } = useGetTeacherSubject({ specialtySubjectId: teacherSubjectId })
    const { data: groups, isLoading: isLoadingGroups } = useGetTeacherGroups({ specialtySubjectId: Number(teacherSubjectId) })
    
    if (isLoadingSubjects || isLoadingGroups) {
        return (
            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Loading...
                    </CardTitle>
                </CardHeader>
            </Card>
        )
    }
    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex-row justify-between -mt-2">
                <CardTitle className="text-2xl font-semibold">
                    {subject?.subjectName}
                </CardTitle>
                <CardDescription className="font-semibold">
                    {subject?.specialtyName} - {subject?.year} year
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="">
                    <h2 className="text-xl font-bold">Groups assingned to</h2>
                    <DataTable 
                                        columns={columns} 
                                        data={groups || []}
                                        filterKeys={["groupName"]}
                    />
                          
                </div>
            </CardContent>
        </Card>
    )
}

type ResponseType = InferResponseType<typeof client.api.teacherUser.groups[":specialtySubjectId"]["$get"], 200>["groups"][0]

export const columns: ColumnDef<ResponseType>[] = [
  
  {
    accessorKey: "groupName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Group
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.groupName}</span>
    )
  },
  
  {
    accessorKey: "assignment",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Assignment
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.assignment}</span>
    )
  },  
 
  
  {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.teacherAssignmentId;

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

const Action = ({id, children}: {id: number, children: ReactNode}) => {

  const router = useRouter();
    const subjectId = useTeacherSubjectId();
  const handleOpen = () => {
    
    router.push(`/dashboard/subject/${subjectId}/group/${id}`);
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