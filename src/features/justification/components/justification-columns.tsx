import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { JustificationAction } from "./justification-action"
import { Justification } from "@/lib/types"


export const justificationColumns: ColumnDef<Justification>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      switch (status) {
        case "pending":
          return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
        case "approved":
          return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
        case "rejected":
          return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
        default:
          return <Badge variant="outline">Unknown</Badge>
      }
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
        console.log("justification", justification)
  
        return (
          <JustificationAction
          justification={justification}
          />
        );
      },
    },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const justification = row.original
      
  //     const handleViewDocument = () => {
  //       if (!justification.fileData) return
        
  //       // Create a blob from the base64 data
  //       const byteCharacters = atob(justification.fileData)
  //       const byteNumbers = new Array(byteCharacters.length)
        
  //       for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i)
  //       }
        
  //       const byteArray = new Uint8Array(byteNumbers)
  //       const blob = new Blob([byteArray], { type: justification.fileType })
        
  //       // Create a URL for the blob and open it in a new tab
  //       const fileURL = URL.createObjectURL(blob)
  //       window.open(fileURL, '_blank')
  //     }

  //     return justification.fileData ? (
  //       <Button 
  //         variant="outline" 
  //         size="sm"
  //         onClick={handleViewDocument}
  //       >
  //         <Eye className="h-4 w-4 mr-1" />
  //         View
  //       </Button>
  //     ) : "No document"
  //   },
  // },
]
