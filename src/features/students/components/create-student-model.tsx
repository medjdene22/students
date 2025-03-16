'use client'
import ResponsiveModel from "@/components/responsive-model";
import { useCreateModel } from "@/hooks/use-create-model";
import { CreateStudentWrapperForm } from "./create-student-wrapper-form";

export default function CreateStudentModel() {
    const { isOpen, setIsOpen, onClose } = useCreateModel({query: "create-student"});


    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={setIsOpen} >
            <CreateStudentWrapperForm  onCancel={onClose} />
        </ResponsiveModel>
    )
}