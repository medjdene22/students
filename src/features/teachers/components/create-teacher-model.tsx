'use client'
import ResponsiveModel from "@/components/responsive-model";
import { useCreateModel } from "@/hooks/use-create-model";
import { CreateTeacherForm } from "./create-teacher-form";

export default function CreateTeacherModel() {
    const { isOpen, setIsOpen, onClose } = useCreateModel({query: "create-teacher"});

    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={setIsOpen} >
            <CreateTeacherForm onCancel={onClose} />
        </ResponsiveModel>
    );
}