import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BookOpen, Calendar } from "lucide-react";


export const SubjectEvent = ({
    subjectName,
    assessmentType,
    eventDate,
    type

}:{
    subjectName: string,
    assessmentType: "exam" | "td" | "tp",
    eventDate: string,
    type?: "test" | "session"
}) => {

    let date
    if(type === 'test' ){
        const split = eventDate.split(" - ");
        date = split[0] + " on " + format(new Date(split?.[1]), "PPP");
        

    }else {
        date = format(new Date(eventDate), "PPP");
    }

    return(
        <Card className="mx-4">
        <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Subject Information
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p className="text-base">{subjectName}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Assessment Type</p>
                <div className="mt-1">{getAssessmentTypeBadge(assessmentType)}</div>
            </div>
            </div>
            <div>
            <p className="text-sm font-medium text-muted-foreground">Absence Date</p>
            <p className="text-base flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                {date}
            </p>
            </div>
        </CardContent>
        </Card>
    )
}

export const getAssessmentTypeBadge = (type: 'exam' | 'td' | 'tp') => {
  switch (type) {
    case "exam":
      return <Badge variant="secondary">Exam</Badge>
    case "td":
      return <Badge variant="secondary">TD</Badge>
    case "tp":
      return <Badge variant="secondary">TP</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}