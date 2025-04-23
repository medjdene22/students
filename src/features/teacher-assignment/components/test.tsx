"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { client } from "@/lib/hono"
import { InferResponseType } from "hono"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetTeachers } from "@/features/teachers/api/use-get-teachers"

// This type is used to define the shape of our data.
type ResponseType = InferResponseType<typeof client.api.teacherAssignment[":id"]['$get'], 200>['teacherAssignments'][0]

// Teacher type literal for type safety
type TeacherType = 'td' | 'tp' | 'exam'

// Define the columns
const columns: ColumnDef<ResponseType>[] = [
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
    id: "teacherAssignment",
    header: "Teacher Assignment",
    columns: [
      {
        accessorKey: "assignTeachers.td",
        header: "TD Teacher",
        cell: ({ row }) => {
          const teachers = row.original.assignTeachers || {}
          return <TeacherAssignmentCell 
            teacher={teachers.td} 
            teacherType="td" 
            assignmentId={teachers.td?.assignmentId}
          />
        },
      },
      {
        accessorKey: "assignTeachers.tp",
        header: "TP Teacher",
        cell: ({ row }) => {
          const teachers = row.original.assignTeachers || {}
          return <TeacherAssignmentCell 
            teacher={teachers.tp} 
            teacherType="tp" 
            assignmentId={teachers.tp?.assignmentId}
          />
        },
      },
      {
        accessorKey: "assignTeachers.exam",
        header: "Exam Teacher",
        cell: ({ row }) => {
          const teachers = row.original.assignTeachers || {}
          return <TeacherAssignmentCell 
            teacher={teachers.exam} 
            teacherType="exam" 
            assignmentId={teachers.exam?.assignmentId}
          />
        },
      },
    ]
  },
]

interface TeacherAssignmentCellProps {
  teacher: ResponseType["assignTeachers"]['td'] | undefined;
  teacherType: TeacherType;
  assignmentId: number | undefined;
}

const TeacherAssignmentCell = ({ teacher, teacherType, assignmentId }: TeacherAssignmentCellProps) => {
  const { data: teachers, isLoading } = useGetTeachers()
  
  const handleTeacherChange = (teacherId: string) => {
    console.log(`Assigning ${teacherType} teacher ${teacherId} to assignment ${assignmentId}`);
    // You would typically call a mutation here to update the assignment
  }

  const teacherId = teacher?.teacherId || ""

  return (
    <Select 
      value={teacherId}
      onValueChange={handleTeacherChange}
      disabled={isLoading}
    >
      <SelectTrigger className="h-8 w-40">
        <SelectValue placeholder="Assign teacher" />
      </SelectTrigger>
      <SelectContent align="end">
        {teachers?.map((teacher) => (
          <SelectItem key={teacher.id} value={teacher.id}>
            {teacher.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface TeacherAssignmentTableProps {
  data: ResponseType[];
}

export function TeacherAssignmentTable({ data }: TeacherAssignmentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Usage example:
// import { TeacherAssignmentTable } from "./teacher-assignment-table"
// 
// export default function TeacherAssignmentPage() {
//   const { data, isLoading } = useGetTeacherAssignments("course-id")
//   
//   if (isLoading) return <div>Loading...</div>
//   
//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-xl font-bold mb-4">Teacher Assignments</h1>
//       <TeacherAssignmentTable data={data.teacherAssignments} />
//     </div>
//   )
// }