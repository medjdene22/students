import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useDeleteStudentEvent } from "../api/use-delete-student-event";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono/client";
import { useTeacherSubjectId } from "../hooks/use-teacher-subject-id";

export type StudentEvent = InferResponseType<typeof client.api.teacherUser["student-events"][":teacherAssignmentId"]["student"][":studentId"]["$get"], 200>['events'][0];

export const columns: ColumnDef<StudentEvent>[] = [
  {
    accessorKey: "event",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.getValue("event") as string;
      let colorClass = "";
      let displayText = "";

      switch (event) {
        case "participation":
          colorClass = "bg-green-100 text-green-800";
          displayText = "Participation";
          break;
        case "absence":
          colorClass = "bg-red-100 text-red-800";
          displayText = "Absence";
          break;
        case "absence_justificated":
          colorClass = "bg-yellow-100 text-yellow-800";
          displayText = "Justified Absence";
          break;
        default:
          displayText = event
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      }

      return (
        <div className="font-medium">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
          >
            {displayText}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "eventDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("eventDate"));
      return <div>{format(date, "PPP")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
      const teacherSubjectId = useTeacherSubjectId()
      const { mutate, isPending } = useDeleteStudentEvent({ teacherSubjectId });

      return (
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => mutate({ param: { id: event.id.toString() } })}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      );
    },
  },
];
