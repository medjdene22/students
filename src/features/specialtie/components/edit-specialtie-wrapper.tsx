import { Loader } from "lucide-react";


import { useGetSpecialtie } from "../api/use-get-specialtie";
import { Card, CardContent } from "@/components/ui/card";
import { SpecialtieForm } from "./edit-specialtie-form";


interface UpdateMajorWrapperFormProps {
    onCancel?: () => void;
    specialtieId: string;
}

export const EditSpecialtieWrapper = ({ onCancel, specialtieId }: UpdateMajorWrapperFormProps) => {


    const { data, isLoading } = useGetSpecialtie({id: specialtieId});

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
            <SpecialtieForm  onCancel={onCancel} initialValues={data!}/>
        </div>
    )
}