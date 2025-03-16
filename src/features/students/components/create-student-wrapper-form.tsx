
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useSpecialtieId } from "@/features/specialtie/hooks/use-specialtie-id";
import { useGetGroupsBySpecialty } from "@/features/student-group/api/use-get-groups-by-specialty";
import { CreateStudentForm } from "./create-student-form";
import { useGetGroupId } from "@/features/student-group/hooks/use-group-id";


interface CreateStudentWrapperFormProps {
    onCancel?: () => void;
}

export function CreateStudentWrapperForm({onCancel}: CreateStudentWrapperFormProps) {

    const specialtyId = useSpecialtieId();
    const groupId = useGetGroupId();
    const { data: groups, isLoading } = useGetGroupsBySpecialty({specialtyId});

    const groupsOptions = groups?.map(group => ({
        id: group.id.toString(),
        name: group.name,
    }));

    if (isLoading) {
        return (
            <Card className="w-full h-[714px] shadow-none border-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }
        
    return (
        <div className="">
            <CreateStudentForm onCancel={onCancel} groupId={groupId} groupOptions={groupsOptions || []} />
        </div>
    )
}