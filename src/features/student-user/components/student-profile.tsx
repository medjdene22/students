"use client";

import { useGetStudent } from "../api/use-get-student";
import { useGetStudentGroup } from "../api/use-get-student-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, BookOpen } from "lucide-react";

export function StudentProfile() {
  const { data: student, isLoading: isLoadingStudent } = useGetStudent();
  const { data: group, isLoading: isLoadingGroup } = useGetStudentGroup();

  if (isLoadingStudent || isLoadingGroup) {
    return <div>Loading...</div>;
  }

  if (!student || !group) {
    return <div>No data available</div>;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Student Profile
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Group</p>
                <p className="font-medium">{group.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Specialty</p>
                <p className="font-medium">{group.specialtyName}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Section</p>
              <p className="font-medium capitalize">{group.section}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium capitalize">{group.year} year - {group.cycleName}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}