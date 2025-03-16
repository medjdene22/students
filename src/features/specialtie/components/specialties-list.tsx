'use client'
// import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMajorId } from "@/features/major/hooks/use-major-id";
import { PlusIcon } from "lucide-react";
import { useGetSpecialtiesByMajor } from "../api/use-get-specialties-by-major";
import { useCreateModel } from "@/hooks/use-create-model";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useDeleteSpecities } from "../api/use-delete-specialties";



export default function SpecialtiesList() {
    const majorId = useMajorId();
    const { data: specialties, isLoading } = useGetSpecialtiesByMajor({ majorId });
    const { mutate: deleteSpecities, isPending } = useDeleteSpecities();


    const isDisabled = isLoading || isPending

    const { open } = useCreateModel({query: "create-specialtie"})

    return (
        <Card className="border shadow-sm">
                <CardHeader className="flex-row items-center justify-between -mt-2">
                    <CardTitle className="text-2xl font-semibold line-clamp-1">Specialties</CardTitle>
                    <Button  className='w-fit' onClick={open}>
                        <PlusIcon className='size-4' />
                        add specialties
                    </Button>
                </CardHeader>

                <CardContent className='flex-1 overflow-auto'>
                    <DataTable disabled={isDisabled} columns={columns} data={specialties ?? []} filterKeys={["name"]} onDelete={
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