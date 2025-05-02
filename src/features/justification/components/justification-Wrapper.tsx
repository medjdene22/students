import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, FileText, Loader, XCircle } from "lucide-react";
import { useGetJustification } from "../api/use-get-justification";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JustificationStatus } from "@/lib/types";
import { SubjectEvent } from "./subject-event";


interface JustificationProps {
  onCancel?: () => void;
  justificationId: string;
}

export const JustificationWrapper = ({ justificationId }: JustificationProps) => {

  const { data, isLoading } = useGetJustification({ justificationId});
  
  console.log("data", data)
  const justification = data?.justification;
  const subjectEvent = data?.subjectEvent;

  
  

  const handleViewDocument = () => {
    if (justification?.fileData) {
      // Default document viewing logiceventDate
      const byteCharacters = atob(justification.fileData)
      const byteNumbers = new Array(byteCharacters.length)
  
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
  
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: justification.fileType })
  
      const fileURL = URL.createObjectURL(blob)
      window.open(fileURL, "_blank")
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full h-44 shadow-none border-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 py-10  h-full">
      {/* Subject Information */}
      {!!subjectEvent && 
        <SubjectEvent type={justification?.justificationType } {...subjectEvent} />
      }

      {/* Justification Details */}
      {!!justification &&<Card className="mx-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Justification Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-1">{getStatusBadge(justification.status as JustificationStatus)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submitted On</p>
              <p className="text-base">{format(new Date(justification.submitDate), "PPP")}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Justification Type</p>
            <p className="text-base capitalize">{justification.justificationType}</p>
          </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-base bg-muted p-3 rounded-md mt-1">{justification.notes}</p>
            </div>

          {justification?.fileData && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Supporting Document</p>
              <Button variant="outline" className="mt-1" onClick={handleViewDocument}>
                <FileText className="h-4 w-4 mr-2" />
                View Document
              </Button>
            </div>
          )}

          {justification?.status === "rejected" && justification?.reason && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
              <div className="flex items-start mt-1 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-base text-red-700">{justification.reason}</p>
              </div>
            </div>
          )}

          {justification?.status === "approved" && justification?.verificationDate && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Verified On</p>
              <p className="text-base">{format(new Date(justification.verificationDate), "PPP")}</p>
            </div>
          )}
        </CardContent>
      </Card>}
    </div>
  );
};


const getStatusBadge = (status: JustificationStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" /> Approved
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

