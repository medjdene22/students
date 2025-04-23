'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTeacherAssignmentId } from "../hooks/use-teacher-assignment-id"
import { useCreateStudentEvent } from "../api/use-create-student-event"
import { format } from "date-fns"
import { DataTable } from "@/components/data-table"
import { columns } from './classroom-attendence-colomns'
import { useGetStudentsEventByDay } from '../api/use-get-students-event-by-day'
import { useTeacherDay } from '../hooks/use-teacher-day'

// type StudentAttendance = {
//   studentId: string
//   name: string
//   email: string
//   status: Events | "default"
//   participationNumber: number
//   absenceNumber: number
//   grade: number
//   subjectStatus: string
// }

export function ClassroomAttendance() {
  const teacherAssignmentId = Number(useTeacherAssignmentId())
  const day = useTeacherDay()
  const { data: events, isLoading } = useGetStudentsEventByDay({ teacherAssignmentId , eventDate: day })

  
  // Transform students data for attendance tracking
  // const initialAttendance = students?.map(student => ({
  //   ...student,
  //   status: "default" as const
  // })) || []
  
  // const [attendance, setAttendance] = useState<StudentAttendance[]>(initialAttendance)
  
  // Update attendance state when students data changes
  // if (students && attendance.length === 0) {
  //   setAttendance(initialAttendance)
  // }
  
  const date = format(new Date(), "dd-MM-yyyy")
  
  // const handleStatusChange = (studentId: string, status: Events | "default") => {
  //   setAttendance(prev => 
  //     prev.map(student => 
  //       student.studentId === studentId 
  //         ? { ...student, status: student.status === status ? "default" : status } 
  //         : student
  //     )
  //   )
  // }
  
  // const handleSaveAttendance = () => {
  //   // Filter students with non-default statuses
  //   const changedRecords = attendance.filter(student => student.status !== "default")
    
  //   // Submit each changed record
  //   changedRecords.forEach(student => {
  //     createEvent({
  //       json: {
  //         studentId: student.studentId,
  //         teacherAssignmentId,
  //         event: student.status as Events,
  //         eventDate: date,
  //       }
  //     })
  //   })
    
  //   // Reset status after saving
  //   setAttendance(prev => prev.map(student => ({ ...student, status: "default" })))
  // }
  
  

  // const hasChanges = attendance.some(student => student.status !== "default")
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">Classroom Attendance</CardTitle>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "PPP")}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <p className="text-muted-foreground">
            Mark students as participating or absent for today's class.
          </p>
          {/* <Button 
            onClick={handleSaveAttendance} 
            disabled={isPending || !hasChanges}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Save Attendance
          </Button> */}
        </div>
        
        <DataTable 
          columns={columns} 
          data={events || []}
          filterKeys={['name']}
          disabled={isLoading }
        />
      </CardContent>
    </Card>
  )
}