'use client'

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { useGetTests } from "../api/use-get-tests";
import { columns } from "./columns";
import { useState } from "react";
import { TestCreateDialog } from "./test-create-dialog";
import { useTeacherAssignmentId } from "@/features/teacher-user/hooks/use-teacher-assignment-id";


export default function TestList() {

    const teacherAssignmentId = useTeacherAssignmentId();
    const { data, isLoading } = useGetTests({ teacherAssignmentId });
    const [showAddForm, setShowAddForm] = useState(false);
    
    const isDisabled = isLoading;
    const tests = data?.tests || [];
    const assignment = data?.assignment ;

    const testType = assignment?.assessment_type === 'exam' ? 'Exam' : 'Test'

    if (isLoading) {
        return (
            <Card className="border shadow-sm">
                <CardHeader className="flex-row items-center justify-between -mt-2">
                    <CardTitle className="text-2xl font-semibold line-clamp-1">List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-full">
                        Loading...
                    </div>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex-row items-center justify-between -mt-2">
                <CardTitle className="text-2xl font-semibold line-clamp-1">{testType} List</CardTitle>
                <Button className="w-fit" onClick={() => setShowAddForm(true)}>
                    <PlusIcon className="size-4" />
                    Add {testType}
                </Button>
            </CardHeader>
            <CardContent>
                {showAddForm && (
                    <div className="mb-6">
                        <TestCreateDialog 
                          teacherAssignmentId={teacherAssignmentId} 
                          isDialogOpen={showAddForm}
                          setIsDialogOpen={setShowAddForm}
                        />
                    </div>
                )}
                
                <DataTable 
                    disabled={isDisabled} 
                    columns={columns} 
                    data={tests} 
                    filterKeys={["name"]} 
                />
            </CardContent>
        </Card>
    )
}
