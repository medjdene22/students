'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { useGetTeachers } from "../api/use-get-teachers";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useCreateModel } from "@/hooks/use-create-model";
import { useDeleteTeachers } from "../api/use-delete-teachers";

export default function TeachersList() {
    const { data: teachers, isLoading } = useGetTeachers();
    const { mutate: deleteTeachers, isPending } = useDeleteTeachers();

    const { open } = useCreateModel({query: "create-teacher"})

    const isDisabled = isLoading || isPending

    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex-row items-center justify-between -mt-2">
                <CardTitle className="text-2xl font-semibold line-clamp-1">Teachers</CardTitle>
                <Button className='w-fit' onClick={open}>
                    <PlusIcon className='size-4' />
                    Add teacher
                </Button>
            </CardHeader>

            <CardContent className='flex-1 overflow-auto'>
                <DataTable 
                    disabled={isLoading} 
                    columns={columns} 
                    data={teachers ?? []} 
                    filterKeys={["name", "email"]} 
                    onDelete={(rows) => {
                        deleteTeachers({
                            json: {
                                ids: rows.map((row) => row.original.id)
                            } 
                        });
                    }}
                />
            </CardContent>
        </Card>
    )
}