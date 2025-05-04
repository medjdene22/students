import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader,  } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { JustificationStatus, verifySchema } from "@/lib/types";
import { SubjectEvent } from "./subject-event";
import { useGetJustificationToVerify } from "../api/use-get-justification-to-verify-teacher";
import TeacherAvatar from "@/features/teachers/components/teacher-avatar";
import { getStatusBadge } from "./justification-Wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useVerifyJustification } from "../api/verify-justification";
import { Role } from "@/lib/types";


interface JustificationProps {
  onCancel?: () => void;
  justificationId: string;
  role:Role
}

export const JustificationVerifyForm = ({ justificationId, onCancel, role }: JustificationProps) => {

  const { data, isLoading } = useGetJustificationToVerify({ justificationId, role});
  const { mutate: verify, isPending } = useVerifyJustification({role});

  
  
  const justification = data?.justification;
  const subjectEvent = data?.subjectEvent;

  const form = useForm<z.infer<typeof verifySchema>>({
    defaultValues: {
        reason: justification?.reason ?? "",
    },
    resolver: zodResolver(verifySchema),
});

  const handleApprove = () => {
    if (!justification) return
    verify({
      param: { justificationId: justification.id.toString() },
      json: {
        reason: form.getValues("reason"),
        status: JustificationStatus.APPROVED,
      },
    },{
      onSuccess: () => {
        onCancel?.();
      }
    })

  }

  const handleReject = async () => {
    if (!justification) return
    verify({
      param: { justificationId: justification.id.toString() },
      json: {
        reason: form.getValues("reason"),
        status: JustificationStatus.REJECTED,
      },
    },{
      onSuccess: () => {
        onCancel?.();
      }
    })
   

  }


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
    <div className="space-y-6 py-10  h-[90vh]">

      <Card className="mx-4">
        <CardHeader className="mb-2">
          <CardTitle className="text-lg flex items-center">
            <TeacherAvatar classname="size-8 mr-2" />
            Student Information
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Student Name</p>
            <p className="text-base">{subjectEvent?.studentname}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Student Email</p>
            <p className="text-base">{subjectEvent?.studentEmail}</p>
          </div>
          </div>
        
        </CardContent>
      </Card>

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


          {justification?.verificationDate && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Verified On</p>
              <p className="text-base">{format(new Date(justification.verificationDate), "PPP")}</p>
            </div>
          )}



        {/* Action Buttons */}
          <Form {...form}>
            <form  className="space-y-6">
                    <FormField control={form.control} name="reason" render={({field}) => (
                        <FormItem>
                            <FormLabel>Reason</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Justification rejection reason / notes ..."
                                className="resize-none min-h-16"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                      <div className="flex  items-center w-full justify-between  "> 

                          <Button type="button" disabled={isPending} variant="secondary" size={"lg"} onClick={onCancel} className={cn("hidden sm:block",!onCancel && 'invisible')}>Cancel</Button>   
                          
                          <div className="flex items-center gap-x-2">
                            <Button type="button" disabled={isPending} variant={'destructive'} onClick={handleReject} size={"lg"} >Reject</Button>
                            <Button type="button" disabled={isPending} variant={'secondary'} onClick={handleApprove} size={"lg"} >Approve</Button>
                      
                          </div>
                        </div>
                
            </form> 
          </Form>  
        </CardContent>
      </Card>} 
    </div>
  );
};
