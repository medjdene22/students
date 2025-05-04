import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { InferResponseType } from "hono/client"
import { client } from "@/lib/hono"
import { Button } from "@/components/ui/button"
import TeacherAvatar from "@/features/teachers/components/teacher-avatar"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useEditModel } from "@/hooks/use-edit-model"

type JustificationToVerify = InferResponseType<typeof client.api.justification['verify']['teacher']['$get'], 200>['justifications'][0]


export const justificationToVerifyColumns: ColumnDef<JustificationToVerify>[] = [
  {
    accessorKey: "studentName",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Student name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <TeacherAvatar name={row.original.studentName} grade={''} classname="size-8" />
        <span className="font-medium">{row.original.studentName}</span>
      </div>
    )
  },
  {
    accessorKey: "assessment",
    header: "Subject",
  },
  {
    accessorKey: "event",
    header: "absence status",
    cell: ({ row }) => {
          const status = row.original.event;

          let badgeVariant:  "outline" | "destructive"  = "destructive";
          let statusText = "";
          if (status === "absence") {
            statusText = "absence";
          } else  {
            badgeVariant = "outline";
            statusText = "Absent Justified";
          } 
    
          return <Badge variant={badgeVariant}>{statusText}</Badge>;
        },
  },
 
  {
    accessorKey: "eventDate",
    header: "Absence Date",
    cell: ({ row }) => {
      const date = new Date(row.original.eventDate)
      return format(date, "PP")
    },
  },
  {
    accessorKey: "submitDate",
    header: "Submit Date",
    cell: ({ row }) => {
      const date = new Date(row.original.submitDate)
      return date ?  format(date, "PP") : "N/A"
    },
  },

  {
      id: "actions",
      cell: ({ row }) => {
        const justification = row.original
  
        return (
          <JustificationToVerifyAction justification={justification} />
        );
      },
    },

  
]


const JustificationToVerifyAction = ({justification}: {justification: JustificationToVerify}) => {

  const {open } = useEditModel({query: 'justification'})

  const handleOpen = () => {
      open(justification.justificationId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleOpen}>Open Justification</DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}