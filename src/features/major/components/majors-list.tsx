'use client'


import { Button } from "@/components/ui/button";
import { useCreateModel } from "@/hooks/use-create-model";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMajors } from "../api/use-get-majors";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useDeleteMajors } from "../api/use-delete-majors";


export default function MajorsList() {

    const { open } = useCreateModel({query: "create-major"});
    const {data: majors , isLoading} = useGetMajors();

    const { mutate: deleteMajors, isPending } = useDeleteMajors();

    const isDisabled = isLoading || isPending;

    return (

            <Card className="border shadow-sm">

                <CardHeader className="flex-row items-center justify-between -mt-2">
                    <CardTitle className="text-2xl font-semibold line-clamp-1">Majors</CardTitle>
                    <Button className="w-fit" onClick={open} >
                        <PlusIcon className="size-4" />
                        add major
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable disabled={isDisabled} columns={columns} data={majors ?? []} filterKeys={["name"]} onDelete={
                        (rows) => {
                            deleteMajors({
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