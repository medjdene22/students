"use client";

import { useGetStudentEvents } from "../api/use-get-student-events";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { columns } from "./student-events-columns";
import { useCreateStudentEvent } from "../api/use-create-student-event";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssignmentStudentId } from "../hooks/use-assignment-student-";
import { useTeacherAssignmentId } from "../hooks/use-teacher-assignment-id";
import { useTeacherSubjectId } from "../hooks/use-teacher-subject-id";

export function StudentEventsList() {
  const studentId = useAssignmentStudentId();
  const teacherAssignmentId = useTeacherAssignmentId();
  const teacherSubjectId = useTeacherSubjectId();
  const { data, isLoading } = useGetStudentEvents({
    teacherSubjectId,
    teacherAssignmentId,
    studentId,
  });
  const { assignment, events, student, studentSubject } = data || {};

  const { mutate: createEvent, isPending: isCreating } = useCreateStudentEvent( { teacherSubjectId });

  const date = format(new Date(), "dd-MM-yyyy");
  const teacherAssignmentIdToPass = assignment?.id || Number(teacherAssignmentId);
  const handleAddParticipation = () => {
    
    createEvent({
      json: {
        studentId,
        teacherAssignmentId: teacherAssignmentIdToPass,
        event: "participation",
        eventDate: date,
      },
    });
  };

  const handleAddAbsence = () => {
    createEvent({
      json: {
        studentId,
        teacherAssignmentId: teacherAssignmentIdToPass,
        event: "absence",
        eventDate: date,
      },
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className=" flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">
          Student Attendance History
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {assignment?.subjectName + " - " + assignment?.assessment_type}
        </div>
      </CardHeader>
      <CardContent>

        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">{student?.name || "Student Details"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{student?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject Status</p>
                <p
                  className={`font-medium ${
                    studentSubject?.subjectStatus === "enrolled"
                      ? "text-green-600"
                      : studentSubject?.subjectStatus === "excluded"
                        ? "text-red-600"
                        : "text-blue-600"
                  }`}
                >
                  {studentSubject?.subjectStatus}
                </p> (total {studentSubject?.totalAbsence} absence)
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p
                  className={`font-medium ${(studentSubject?.assignmentGrade ?? 0 ) >= 2.5 ? "text-green-600" : "text-red-600"}`}
                >
                  {studentSubject?.assignmentGrade}
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-500">Participations in {assignment?.assessment_type}</p>
                  <p className="font-medium text-green-600">
                    {studentSubject?.participationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Absences in {assignment?.assessment_type}</p>
                  <p className="font-medium text-red-600">
                    {studentSubject?.absenceNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>


        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleAddParticipation}
            disabled={isCreating}
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Participation
          </Button>
          <Button
            onClick={handleAddAbsence}
            disabled={isCreating}
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Absence
          </Button>
        </div>

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={events || []}
            filterKeys={["event"]}
            // pageSize={6}
            disabled={isLoading || isCreating}
          />
        </div>
      </CardContent>
    </Card>
  );
}
