import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, ScrollText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { useRouter } from "next/navigation";
import { useTeacherSubjectId } from "../hooks/use-teacher-subject-id";
import { useTeacherAssignmentId } from "../hooks/use-teacher-assignment-id";

type Student = InferResponseType<typeof client.api.teacherUser["group"][":teacherAssignmentId"]["$get"], 200>['students'][0];


export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "participationNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Participations
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("participationNumber")}</div>
    ),
  },
  {
    accessorKey: "absenceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Absences
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("absenceNumber")}</div>
    ),
  },
  {
    accessorKey: "grade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.assignmentGrade}</div>
    ),
  },
  {
    accessorKey: "subjectStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("subjectStatus") as string;
      return (
        <div className="font-medium">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              status === "enrolled"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAbsence",
    header: "Total Absences",
    cell: ({ row }) => {
      return (
        <div className="text-center">{row.getValue("totalAbsence")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      

      return (
          <StudentActionsCell student={student} />  

      );
    },
  },
];

function StudentActionsCell({ student }: { student: Student }) {
  const router = useRouter();
  const teacherSubjectId = useTeacherSubjectId();
  const teacherAssignmentId = useTeacherAssignmentId();
  
  const onClick = () => {      
    router.push(`/dashboard/subject/${teacherSubjectId}/group/${teacherAssignmentId}/student/${student.studentId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onClick}>
          <ScrollText className="mr-2 h-4 w-4" />
          View Attendance history
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}