import { AppealForm } from "./appeal-form";
import { useGetEventJustification } from "../api/use-get-event-justification";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { SubjectEvent } from "./subject-event";

interface AppealProps {
  onCancel?: () => void;
  eventId: string;
  type: "session" | "test";
}

export const AppealWrapper = ({ onCancel, eventId, type }: AppealProps) => {
  const { data, isLoading } = useGetEventJustification({ eventId, type });
  const { justification, subjectEvent } = data || {};

  const file = `data:${justification?.fileType};base64,${justification?.fileData}`;

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
    <div  className=" py-10  h-[90vh]">
      {!!subjectEvent && 
        <SubjectEvent type={type } {...subjectEvent} />
      }

      <AppealForm
        onCancel={onCancel}
        eventId={eventId}
        justification={justification}
        file={file}
        type={type}
      />
    </div>
  );
};
