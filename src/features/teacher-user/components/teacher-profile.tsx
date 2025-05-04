"use client";

import { useGetTeacher } from "../api/use-get-teacher";
// import { useGetStudentGroup } from "../api/use-get-student-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useGetTeacherSubjects } from "../api/use-get-subjects";
import { DataTable } from "@/components/data-table";
import { subjectsColumns } from "./subjects-columns";

export function TeacherProfile() {
  const { data: student, isLoading: isLoadingStudent } = useGetTeacher();
  const { data: subjects, isLoading: isLoadingSubjects } = useGetTeacherSubjects();

  if (isLoadingStudent || isLoadingSubjects) {
    return <div>Loading...</div>;
  }

  if (!student || !subjects) {
    return <div>No data available</div>;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Teacher Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary text-primary-foreground rounded-full p-3">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
        </div>
        
        <div className="">
          <h2 className="text-xl font-bold">Subjects</h2>
          <DataTable 
                              columns={subjectsColumns} 
                              data={subjects || []}
                              filterKeys={["subjectName"]}
            />
          
        </div>
      </CardContent>
    </Card>
  );
}