'use client'
import ResponsiveModel from "@/components/responsive-model";
import { SpecialtieForm } from "./specialtie-form";
import { useCreateModel } from "@/hooks/use-create-model";
import { useMajorId } from "@/features/major/hooks/use-major-id";

export default function CreateSpecialtieModel() {
    const majorId = Number(useMajorId())
    const { isOpen, setIsOpen, onClose } = useCreateModel({query: "create-specialtie"});


    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={setIsOpen} >
            <SpecialtieForm majorId={majorId} onCancel={onClose} />
        </ResponsiveModel>
    )
}