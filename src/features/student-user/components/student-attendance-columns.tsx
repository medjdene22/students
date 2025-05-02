import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono/client";
import { Badge } from "@/components/ui/badge"
// import { Events } from "@/lib/types";
import { StudentAppealAction } from "./student-appeal-action";

export type StudentEvent = InferResponseType<typeof client.api.studentUser.events[":subjectId"]["$get"], 200>['events'][0];

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
      const event = row.original.event;
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
        case "absence_justified":
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
      const event = row.original;
      let eventDate = event.eventDate;
      const eventType = event.type;
      let extra = "";
      if (eventType === "test") {
       [ extra, eventDate] = eventDate.split(" - ");
        
      }
      console.log(eventDate)
      return (
        <Badge variant="outline">
          {extra && <p className="mr-1">{extra + " on"}  </p>}
                {format(new Date(eventDate), 'PPP')}
        </Badge>
      )
    },
  },
  {
    accessorKey: "assessmentType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("assessmentType") as string;
      return <div className="capitalize">{type}</div>;
    },
  },
  {
      id: "actions",
      cell: ({ row }) => {
        const studentEvent = row.original;
  
        return (
          // <div className="flex justify-end">hi</div>
          <StudentAppealAction
            EventToAppeal={studentEvent}
          />
        );
      },
    },

];