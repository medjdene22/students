'use client'

import { Button } from "@/components/ui/button";
import { useCreateModel } from "@/hooks/use-create-model";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubjects } from "../api/use-get-subjects";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useDeleteSubjects } from "../api/use-delete-subjects";

export default function SubjectsList() {
    const { open } = useCreateModel({query: "create-subject"});
    const {data: subjects, isLoading} = useGetSubjects();
    const { mutate: deleteSubjects, isPending } = useDeleteSubjects();

    const isDisabled = isLoading || isPending;

    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex-row items-center justify-between -mt-2">
                <CardTitle className="text-2xl font-semibold line-clamp-1">Subjects</CardTitle>
                <Button className="w-fit" onClick={open} >
                    <PlusIcon className="size-4" />
                    add subject
                </Button>
            </CardHeader>
            <CardContent>
                <DataTable 
                    disabled={isDisabled} 
                    columns={columns} 
                    data={subjects ?? []} 
                    filterKeys={["name"]} 
                    onDelete={(rows) => {
                        deleteSubjects({
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