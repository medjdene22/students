'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { EditMajorWrapper } from "./edit-major-wrapper"


export default function EditMajorModel() {

    const { id, onClose } = useEditModel({ query: 'edit-major'})
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose} >
                    {!!id && <EditMajorWrapper majorId={id} onCancel={onClose} />}
        </ResponsiveModel>
    )
}