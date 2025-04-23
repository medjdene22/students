'use client'
import ResponsiveModel from "@/components/responsive-model";
import { CreateSubjectForm } from "./create-subject-form";
import { useCreateModel } from "@/hooks/use-create-model";

export default function CreateSubjectModel() {
    const { isOpen, setIsOpen, onClose } = useCreateModel({query: "create-subject"});

    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={setIsOpen} >
            <CreateSubjectForm onCancel={onClose} />
        </ResponsiveModel>
    )
}