'use client'
// import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { useCreateModel } from "@/hooks/use-create-model";
import { DataTable } from "@/components/data-table";
import { useSpecialtieId } from "@/features/specialtie/hooks/use-specialtie-id";
import { useGetGroupsBySpecialty } from "../api/use-get-groups-by-specialty";
import { columns } from "./columns";
import { useDeleteGroups } from "../api/use-delete-groups";



export default function GroupList() {
    const specialtyId = useSpecialtieId()
    const { data: groups, isLoading } = useGetGroupsBySpecialty({ specialtyId });
    const { mutate: deleteSpecities, isPending } = useDeleteGroups();


    const isDisabled = isLoading || isPending

    const { open } = useCreateModel({query: "create-group"})

    return (
        <Card className="border shadow-sm">
                <CardHeader className="flex-row items-center justify-between -mt-2">
                    <CardTitle className="text-2xl font-semibold line-clamp-1">Groups</CardTitle>
                    <Button  className='w-fit' onClick={open}>
                        <PlusIcon className='size-4' />
                        add group
                    </Button>
                </CardHeader>

                <CardContent className='flex-1 overflow-auto'>
                    <DataTable disabled={isDisabled} columns={columns} data={groups ?? []} filterKeys={["name"]} onDelete={
                                            (rows) => {
                                                deleteSpecities({
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