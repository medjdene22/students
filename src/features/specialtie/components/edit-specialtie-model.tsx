'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { EditSpecialtieWrapper } from "./edit-specialtie-wrapper"


export default function EditSpecialtieModel() {

    const { id, onClose } = useEditModel({ query: 'edit-specialtie'})
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose} >
                    {!!id && <EditSpecialtieWrapper  onCancel={onClose} specialtieId={id} />}
        </ResponsiveModel>
    )
}