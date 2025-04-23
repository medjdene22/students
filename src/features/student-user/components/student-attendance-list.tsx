"use client";

import { useGetStudentEvents } from "../api/use-get-student-events";
import { DataTable } from "@/components/data-table";
import { columns } from "./student-attendance-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentSubjectId } from "../hooks/use-student-class-id";

export function StudentAttendanceList() {
  const subjectId = Number(useStudentSubjectId());
  const { data, isLoading } = useGetStudentEvents({
    subjectId,
  });
  const { events } = data || { events: [] };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">
          Attendance History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={events || []}
            filterKeys={["event"]}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}