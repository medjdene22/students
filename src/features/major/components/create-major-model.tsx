'use client'
import ResponsiveModel from "@/components/responsive-model";
import { CreateMajorForm } from "./create-major-form";
import { useCreateModel } from "@/hooks/use-create-model";

export default function CreateMajorModel() {
    const { isOpen, setIsOpen, onClose } = useCreateModel({query: "create-major"});


    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={setIsOpen} >
            <CreateMajorForm onCancel={onClose} />
        </ResponsiveModel>
    )
}