'use client'
// import { Dotted } from "@/components/dotted";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useGetTeacherAssignments } from "../api/use-get-teacher-assignments";
import { useGetGroupId } from "@/features/student-group/hooks/use-group-id";



export default function TeacherAssignList() {
    
    const id = useGetGroupId()
    const { data: assignments, isLoading } = useGetTeacherAssignments({ id });

    const isDisabled = isLoading

    return (
        <Card className="border shadow-sm">
                <CardHeader className="flex-row items-center justify-between -mt-2">
                    <CardTitle className="text-2xl font-semibold line-clamp-1">Assign teachers</CardTitle>
                    
                </CardHeader>

                <CardContent className='flex-1 overflow-auto'>
                    <DataTable disabled={isDisabled} columns={columns} data={assignments ?? []} filterKeys={["subjectName"]} onDelete={
                                            () => {
                                                
                                            }
                    } />
                </CardContent>

        </Card>
    )
}