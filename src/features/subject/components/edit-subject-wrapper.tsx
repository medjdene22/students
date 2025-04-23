import { Card, CardContent } from "@/components/ui/card";
import { useGetSubject } from "../api/use-get-subject";
import { Loader } from "lucide-react";
import { EditSubjectForm } from "./edit-subject-form";

interface UpdateSubjectWrapperFormProps {
    onCancel?: () => void;
    subjectId: string;
}

export function EditSubjectWrapper({ onCancel, subjectId }: UpdateSubjectWrapperFormProps) {
    const {data: subject, isLoading} = useGetSubject({id: subjectId});
    
    if (isLoading) {
        return (
            <Card className="w-full h-44 shadow-none border-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }
    
    return (
        <div>
            <EditSubjectForm initialSubject={subject!} onCancel={onCancel} />
        </div>
    )
}