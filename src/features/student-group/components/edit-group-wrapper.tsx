import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { GroupForm } from "./edit-group-form";
import { useGetGroup } from "../api/use-get-group";
import { useGetSpecialtiesByMajor } from "@/features/specialtie/api/use-get-specialties-by-major";
import { useGetSpecialtie } from "@/features/specialtie/api/use-get-specialtie";


interface UpdateMajorWrapperFormProps {
    onCancel?: () => void;
    groupId: string;
}

export const EditGroupWrapper = ({ onCancel, groupId }: UpdateMajorWrapperFormProps) => {


    const { data, isLoading: isLoadingGroup } = useGetGroup({id: groupId});
    const specialtyId = data?.specialtyId?.toString();
    const { data: specialty, isLoading: isLoadingSpecialty } = useGetSpecialtie(
        specialtyId ? {id: specialtyId} : {id: ''}
    );
    
    const majorId = specialty?.majorId?.toString();
    const { data: specialties, isLoading: isLoadingOptions } = useGetSpecialtiesByMajor(
        majorId ? {majorId: majorId} : {majorId: ''}
    );

    const specialtyOptions = specialties?.map(specialty => ({
        id: specialty.id.toString(),
        name: specialty.name,
    }));

    const isLoading = isLoadingGroup || isLoadingSpecialty || isLoadingOptions;

    if (isLoading) {
        return (
            <Card className="w-full h-72 shadow-none border-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <div >
            <GroupForm specialtyOptions={specialtyOptions || []} onCancel={onCancel} initialValues={data!}/>
        </div>
    )
}

