
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { CreateGroupForm } from "./create-group-form";
import { useGetSpecialtiesByMajor } from "@/features/specialtie/api/use-get-specialties-by-major";
import { useMajorId } from "@/features/major/hooks/use-major-id";

import { useSpecialtieId } from "@/features/specialtie/hooks/use-specialtie-id";


interface CreateTaskWrapperFormProps {
    onCancel?: () => void;
}

export function CreateGroupWrapperForm({onCancel}: CreateTaskWrapperFormProps) {


    const majorId = useMajorId();
    const specialtyId = useSpecialtieId();
    const { data: specialties, isLoading } = useGetSpecialtiesByMajor({majorId});

    const specialtyOptions = specialties?.map(specialty => ({
        id: specialty.id.toString(),
        name: specialty.name,
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
            <CreateGroupForm onCancel={onCancel} majorId={Number(majorId)} specialtyId={specialtyId} specialtyOptions={specialtyOptions || []} />
        </div>
    )
}