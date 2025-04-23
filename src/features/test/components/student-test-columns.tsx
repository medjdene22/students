"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StudentTestAction } from "./student-test-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { InferResponseType } from "hono/client"
import { client } from "@/lib/hono"
import { Events } from "@/lib/types";

type StudentTest = InferResponseType<typeof client.api.test[':teacherAssignmentId'][":testId"]["$get"], 200>['studentToTest'][0]

export const studentTestColumns: ColumnDef<StudentTest>[] = [
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
      <span className="font-medium pl-4">{row.original.name}</span>
    ),
  },

  {
    accessorKey: "subjectStatus",
    header: "Subject Status",
    cell: ({ row }) => {
      const status = row.original.subjectStatus;
      return (
        <Badge variant={status === "excluded" ? "destructive" : "outline"}>
          {status === "excluded" ? "Excluded" : "Enrolled"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "testStatus",
    header: "Status",
    cell: ({ row }) => {
      const subjectStatus = row.original.subjectStatus;
      const status = row.original.testStatus;
      let badgeVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
      let statusText = "Taken";

      if (subjectStatus === "excluded") {
        statusText = "not eligible";
      } else if (status === Events.ABSENCE) {
        badgeVariant = "destructive";
        statusText = "Absent";
      } else if (status === Events.ABSENCE_JUSTIFIED) {
        badgeVariant = "secondary";
        statusText = "Absent Justified";
      } 

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const isDisabled = student.subjectStatus === "excluded" || student.testStatus === Events.ABSENCE_JUSTIFIED;

      return (
        <StudentTestAction
          studentId={student.studentId}
          studentName={student.name}
          eventId={student.eventId?.toString()}
          currentStatus={student.testStatus}
          isDisabled={isDisabled}
        />
      );
    },
  },
];
