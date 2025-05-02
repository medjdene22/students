import { Button } from "@/components/ui/button"
import { client } from "@/lib/hono";
import { Events } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table"
import { InferResponseType } from "hono/client";
import { UserMinus, UserPlus } from "lucide-react"
import { useCreateStudentEvent } from "../api/use-create-student-event";
// import { useGetTeacher } from "../api/use-get-teacher";
// import { useTeacherAssignmentId } from "../hooks/use-teacher-assignment-id";
// import { useTeacherDay } from "../hooks/use-teacher-day";
import { useDeleteStudentEvent } from "../api/use-delete-student-event";
import { useTeacherSubjectId } from "../hooks/use-teacher-subject-id";



export type StudentAttendance = InferResponseType<typeof client.api.teacherUser["student-events"][":teacherAssignmentId"]["date"][":eventDate"]["$get"], 200>['events'][0];

export const columns: ColumnDef<StudentAttendance>[] = [
    {
      accessorKey: "name",
      header: "Student Name",
      cell: ({ row }) => <div className="font-medium">{row.original.studentName}</div>,
    },
    {
      accessorKey: "event",
      header: "Today's Attendance",
      cell: ({ row }) => {
        const student = row.original
        return (
          <Attendance student={student} />
        )
      }
    },
    
]

const Attendance = ({ student }: { student: StudentAttendance }) => {


    const teacherSubjectId = useTeacherSubjectId()
    const { mutate: createEvent, isPending: isPendingCreated } = useCreateStudentEvent({ teacherSubjectId });
    const { mutate: deleteEvent, isPending: isPendingDeleted } = useDeleteStudentEvent({ teacherSubjectId });

    const handleStatusChange = (event: Events) => {
      if(student.event === event && !!student.eventId) {
        deleteEvent({ param: { id: student.eventId.toString() } })
        return
      }
      createEvent({
        json: {
          studentId: student.studentId,
          teacherAssignmentId: student.teacherAssignmentId,
          event,
          eventDate: student.eventDate
        }
      })
    }
    const isPending = isPendingCreated || isPendingDeleted

    return (
      <div className="flex gap-2">
        <Button disabled={isPending}
          variant={student.event === Events.PARTICIPATION ? "default" : "outline"}
          size="sm"
          className={student.event === Events.PARTICIPATION ? "bg-green-600" : "hover:bg-green-100"}
          onClick={() => handleStatusChange(Events.PARTICIPATION)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Participation
        </Button>
        <Button disabled={isPending}
          variant={student.event === Events.ABSENCE ? "default" : "outline"}
          size="sm"
          className={student.event === Events.ABSENCE ? "bg-red-600" : "hover:bg-red-100"}
          onClick={() => handleStatusChange(Events.ABSENCE)}
        >
          <UserMinus className="h-4 w-4 mr-1" />
          Absence
        </Button>
      </div>
    )
  }


