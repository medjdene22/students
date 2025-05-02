"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { client } from "@/lib/hono"
import { InferResponseType } from "hono"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetTeachers } from "@/features/teachers/api/use-get-teachers"
import { useCreateTeacherAssignment } from "../api/use-create-teacher-assignment"
import { useGetGroupId } from "@/features/student-group/hooks/use-group-id"
import { useUpdateTeacherAssignment } from "../api/use-update-teacher-assignment"
import { useDeleteTeacherAssignment } from "../api/use-delete-teacher-assignment"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type ResponseType = InferResponseType<typeof client.api.teacherAssignment[":id"]['$get'], 200>['teacherAssignments'][0]


export const columns: ColumnDef<ResponseType>[] = [
  
  {
    accessorKey: "subjectName",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Subject name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>

    
          </div>
          
        )
    },
    cell: ({ row }) => (
      <span className="font-medium pl-4">{row.original.subjectName}</span>
    )
  },

  {
    accessorKey: "assignTeachers.td",
    header: "TD teacher",
    cell: ({ row }) => {
      const teachers_td = row.original.assignTeachers.td 
      const specialtySubjectId = row.original.specialtySubjectId
      return <TeacherAssignmentCell assignmentId={teachers_td?.assignmentId} teacherId={teachers_td?.teacherId} assessment_type={"td"} specialtySubjectId={specialtySubjectId} />
    },
  },
  {
    accessorKey: "assignTeachers.tp",
    header: "TP teacher",
    cell: ({ row }) => {
      const teachers_tp = row.original.assignTeachers.tp 
      const specialtySubjectId = row.original.specialtySubjectId

      return <TeacherAssignmentCell assignmentId={teachers_tp?.assignmentId} teacherId={teachers_tp?.teacherId} assessment_type={"tp"} specialtySubjectId={specialtySubjectId}/>
    },
  },
  {
    accessorKey: "assignTeachers.exam",
    header: "EXAM teacher",
    cell: ({ row }) => {
      const teachers_exam = row.original.assignTeachers.exam
      const specialtySubjectId = row.original.specialtySubjectId
 
      return <TeacherAssignmentCell assignmentId={teachers_exam?.assignmentId} teacherId={teachers_exam?.teacherId} assessment_type={"exam"} specialtySubjectId={specialtySubjectId}/>
    },
  },
]

type teacher = {
  assignmentId: number | undefined;
  teacherId: string | undefined;
  assessment_type: "exam" | "td" | "tp";
  specialtySubjectId: number ;
}


const TeacherAssignmentCell = ({ assignmentId, teacherId, assessment_type , specialtySubjectId}: teacher) => {
  const { data: teachers, isLoading } = useGetTeachers()

  const { mutate: assignTeacher, isPending } = useCreateTeacherAssignment()
  const { mutate: updateTeacher, isPending: isPendingUpdate } = useUpdateTeacherAssignment()
  const { mutate: deleteTeacher, isPending: isPendingDelete } = useDeleteTeacherAssignment()

  const groupId = useGetGroupId()

  const handleTeacherChange = (teacherId: string) => {
    if (teacherId === 'delete' && !!assignmentId) {
      deleteTeacher({ param: { assignmentId: assignmentId?.toString() } })
      return
    }
    if (!!assignmentId) {
      const assignmentToUpdate = assignmentId.toString()
      updateTeacher({ json: { teacherId }, param: { assignmentId: assignmentToUpdate } })
    }
    else { assignTeacher({ json: { teacherId, assessment_type, specialtySubjectId }, param: { groupId } }) }
  }
  return (
    <Select 
      value={teacherId}
      onValueChange={handleTeacherChange}
      disabled={isLoading || isPending || isPendingUpdate || isPendingDelete}
    >
      <SelectTrigger className="h-8 w-40">
        <SelectValue placeholder="Assign teacher" />
      </SelectTrigger>
      <SelectContent align="end">
        {!!assignmentId && (
            <SelectItem key={'delete'} value={'delete'}>
              Remove teacher
            </SelectItem>
        )}
        {teachers?.map((teacher) => (
          <SelectItem key={teacher.id} value={teacher.id}>
            {teacher.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}