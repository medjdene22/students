'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetGroupId } from "@/features/student-group/hooks/use-group-id";
import { PlusIcon } from "lucide-react";
import { useGetStudentsByGroup } from "../api/use-get-student-by-group";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useCreateModel } from "@/hooks/use-create-model";
import { useDeleteStudents } from "../api/use-delete-students";


export default function StudentsList() {
 
    const groupId = useGetGroupId()
    const { data: students, isLoading } = useGetStudentsByGroup({ groupId });
    const { mutate: deleteStudents, isPending } = useDeleteStudents();

    const { open } = useCreateModel({query: "create-student"})

    const isDisabled = isLoading || isPending

    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex-row items-center justify-between -mt-2">
                    <CardTitle className="text-2xl font-semibold line-clamp-1">Students</CardTitle>
                    <Button  className='w-fit' onClick={open}>
                        <PlusIcon className='size-4' />
                        add student
                    </Button>
            </CardHeader>

            <CardContent className='flex-1 overflow-auto'>
                <DataTable disabled={isDisabled} columns={columns} data={students ?? []} filterKeys={["name"]} onDelete={
                        (rows) => {
                            deleteStudents({
                                json: {
                                    ids: rows.map((row) => row.original.id)
                                } 
                            });
                        }
                } />
            </CardContent>
        </Card>
    )
}