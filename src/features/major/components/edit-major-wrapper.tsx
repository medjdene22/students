import { Card, CardContent } from "@/components/ui/card";
import { useGetMajor } from "../api/use-get-major";
import { Loader } from "lucide-react";
import { EditMajorForm } from "./edit-major-form";

interface UpdateMajorWrapperFormProps {
    onCancel?: () => void;
    majorId: string;
}

export function EditMajorWrapper({ onCancel, majorId }: UpdateMajorWrapperFormProps) {

    const {data: major, isLoading} = useGetMajor({id: majorId});
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
            <EditMajorForm initialMajor={major!} onCancel={onCancel} />
        </div>
    )
}