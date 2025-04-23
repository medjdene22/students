'use client'

import { Button } from "@/components/ui/button"
import { useGetSpecialtiesBySubject } from "../api/use-get-specialties-by-subject"
import { useSubjectId } from "../hooks/use-subject-id"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { specialtiesColumns } from "./specialties-columns"
import { useDeleteSubjectSpecalties } from "../api/use-delete-subject-specialties"
import { AddSpecialtyForm } from "./add-specialty-form"
import { useState } from "react"
import { PlusIcon } from "lucide-react"

export default function SubjectSpecialtiesList() {
    const subjectId = useSubjectId()
    const { data: specialties, isLoading } = useGetSpecialtiesBySubject({ id: subjectId })
    const { mutate: deleteSpecialties, isPending } = useDeleteSubjectSpecalties()
    const [showAddForm, setShowAddForm] = useState(false)

    const isDisabled = isLoading || isPending

    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex-row items-center justify-between -mt-2">
                <CardTitle className="text-2xl font-semibold line-clamp-1">Specialty Assignments</CardTitle>
                <Button className="w-fit" onClick={() => setShowAddForm(true)}>
                    <PlusIcon className="size-4" />
                    Add to specialty
                </Button>
            </CardHeader>
            <CardContent>
                {showAddForm && (
                    <div className="mb-6">
                        <AddSpecialtyForm onCancel={() => setShowAddForm(false)} />
                    </div>
                )}
                
                <DataTable 
                    disabled={isDisabled} 
                    columns={specialtiesColumns} 
                    data={specialties ?? []} 
                    filterKeys={["specialtyName"]} 
                    onDelete={(rows) => {
                        deleteSpecialties({
                            json: {
                                ids: rows.map((row) => row.original.specialtySubjectId)
                            },
                            param: { id: subjectId }
                        });
                    }}
                />
            </CardContent>
        </Card>
    )
}