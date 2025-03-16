import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EditTeacherForm } from "./edit-teacher-form";
import { useGetTeacher } from "../api/use-get-teacher";

interface EditTeacherWrapperProps {
    onCancel?: () => void;
    teacherId: string;
}

export const EditTeacherWrapper = ({ onCancel, teacherId }: EditTeacherWrapperProps) => {
    const { data: teacher, isLoading: isLoadingTeacher } = useGetTeacher({ id: teacherId });
    
    const isLoading = isLoadingTeacher;

    if (isLoading || !teacher) {
        return (
            <Card className="w-full h-72 shadow-none border-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div>
            <EditTeacherForm 
                onCancel={onCancel} 
                initialValues={teacher}
            />
        </div>
    );
}