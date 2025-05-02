'use client'

import { useGetTeacherStudents } from "../api/use-get-teacher-students";
import { DataTable } from "@/components/data-table";
import { columns } from "./student-list-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherAssignmentId } from "../hooks/use-teacher-assignment-id";
import { useTeacherSubjectId } from "../hooks/use-teacher-subject-id";


export default function StudentList() {

  const teacherAssignmentId = useTeacherAssignmentId();
  const teacherSubjectId = useTeacherSubjectId();

  const { data, isLoading } = useGetTeacherStudents({
    teacherSubjectId,
    teacherAssignmentId,
  });

  const { students, assignment } = data || {};
  if (isLoading || assignment?.assessment_type === "exam") {
    return (
      <div >
        
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      <Card className="border shadow-sm">
        <CardHeader className=" flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Students List</CardTitle>
          <div className="text-sm text-muted-foreground">
            {assignment?.subjectName + " - " + assignment?.assessment_type}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={students || []} 
            filterKeys={['name']} 
            onDelete={()=>{}} 
            disabled={isLoading}       
          />
        </CardContent>
      </Card>
    </div>
  );
}
