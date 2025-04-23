'use client'

import { Button } from "@/components/ui/button"
import { useGetSubjectsBySpecialty } from "../api/use-get-subjects-by-specialty"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { subjectsColumns } from "./subjects-columns"
import { useDeleteSubjectsFromSpecialty } from "../api/use-delete-subjects-from-specialty"
import { AddSubjectForm } from "./add-subject-form"
import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { useSpecialtieId } from "../hooks/use-specialtie-id"

export default function SpecialtySubjectsList() {
    const specialtyId = useSpecialtieId()
    const { data: subjects, isLoading } = useGetSubjectsBySpecialty({ id: specialtyId })
    const { mutate: deleteSubjects, isPending } = useDeleteSubjectsFromSpecialty()
    const [showAddForm, setShowAddForm] = useState(false)

    const isDisabled = isLoading || isPending

    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex-row items-center justify-between -mt-2">
                <CardTitle className="text-2xl font-semibold line-clamp-1">Assigned Subjects</CardTitle>
                <Button className="w-fit" onClick={() => setShowAddForm(true)}>
                    <PlusIcon className="size-4" />
                    Add subject
                </Button>
            </CardHeader>
            <CardContent>
                {showAddForm && (
                    <div className="mb-6">
                        <AddSubjectForm onCancel={() => setShowAddForm(false)} />
                    </div>
                )}
                
                <DataTable 
                    disabled={isDisabled} 
                    columns={subjectsColumns} 
                    data={subjects ?? []} 
                    filterKeys={["subjectName"]} 
                    onDelete={(rows) => {
                        deleteSubjects({
                            json: {
                                ids: rows.map((row) => row.original.specialtySubjectId)
                            },
                            param: { id: specialtyId }
                        });
                    }}
                />
            </CardContent>
        </Card>
    )
}