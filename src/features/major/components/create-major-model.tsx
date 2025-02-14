'use client'
import ResponsiveModel from "@/components/responsive-model";
import { useCreateMajorModel } from "../hooks/use-create-major-model";
import { CreateMajorForm } from "./create-major-form";

export default function CreateMajorModel() {
    const { isOpen, setIsOpen, onClose } = useCreateMajorModel();


    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={setIsOpen} >
            <CreateMajorForm onCancel={onClose} />
        </ResponsiveModel>
    )
}