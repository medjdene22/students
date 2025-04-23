"use client";

import { useGetStudentEvents } from "../api/use-get-student-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentSubjectId } from "../hooks/use-student-class-id";
import { CheckCircle, AlertCircle, GraduationCap, User } from "lucide-react";

export function StudentAttendanceSummary() {
  const subjectId = Number(useStudentSubjectId());
  const { data, isLoading } = useGetStudentEvents({
    subjectId,
  });
  const { subject } = data || {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!subject) {
    return <div>No data available</div>;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {subject.subjectName} - Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-md flex items-center">
            <CheckCircle className="h-10 w-10 text-green-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Participations</div>
              <div className="text-2xl font-bold text-green-700">{subject.participationNumber || 0}</div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-md flex items-center">
            <AlertCircle className="h-10 w-10 text-red-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Absences</div>
              <div className="text-2xl font-bold text-red-700">{subject.absenceNumber || 0}</div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md flex items-center">
            <GraduationCap className="h-10 w-10 text-blue-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Current Grade</div>
              <div className={`text-2xl font-bold ${(subject.grade >= 5) ? 'text-green-700' : 'text-red-700'}`}>
                {subject.grade || "N/A"}
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-md flex items-center">
            <User className="h-10 w-10 text-purple-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className={`text-lg font-bold ${subject.subjectStatus === 'enrolled' ? 'text-green-700' : 'text-red-700'}`}>
                {subject.subjectStatus?.charAt(0).toUpperCase() + subject.subjectStatus?.slice(1) || "Unknown"}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Teachers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subject.teachers?.map((teacher) => (
              <div key={teacher.id} className="border rounded-md p-3 bg-gray-50">
                <div className="font-medium">{teacher.teacherName}</div>
                <div className="text-sm text-gray-500 capitalize">{teacher.assessmentType}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}