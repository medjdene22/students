import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EditStudentForm } from "./edit-student-form";
// import { useGetStudentsByGroup } from "../api/use-get-student-by-group";
import { useGetStudent } from "../api/use-get-student";
import { useGetGroupsBySpecialty } from "@/features/student-group/api/use-get-groups-by-specialty";
import { useSpecialtieId } from "@/features/specialtie/hooks/use-specialtie-id";

interface EditStudentWrapperProps {
    onCancel?: () => void;
    studentId: string;
}

export const EditStudentWrapper = ({ onCancel, studentId }: EditStudentWrapperProps) => {
    const { data: student, isLoading: isLoadingStudent } = useGetStudent({ id: studentId });
    const specialtyId = useSpecialtieId();
    const { data: groups, isLoading: isLoadingGroups } = useGetGroupsBySpecialty({ specialtyId });
    
    const groupOptions = groups?.map(group => ({
        id: group.id,
        name: group.name,
    })) || [];

    const isLoading = isLoadingStudent || isLoadingGroups;

    if (isLoading || !student) {
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
            <EditStudentForm 
                groupOptions={groupOptions} 
                onCancel={onCancel} 
                initialValues={student}
            />
        </div>
    );
}