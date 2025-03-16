'use client'
import ResponsiveModel from "@/components/responsive-model";
import { useCreateModel } from "@/hooks/use-create-model";
import { CreateGroupWrapperForm } from "./create-group-wrapper-form";

export default function CreateGroupModel() {
    const { isOpen, setIsOpen, onClose } = useCreateModel({query: "create-group"});


    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={setIsOpen} >

            <CreateGroupWrapperForm  onCancel={onClose} />
        </ResponsiveModel>
    )
}