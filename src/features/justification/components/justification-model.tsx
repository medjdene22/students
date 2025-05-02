'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { JustificationWrapper } from "./justification-Wrapper"
// import { EditMajorWrapper } from "./edit-major-wrapper"


export default function JustificationModel() {

    const { id, onClose } = useEditModel({ query: 'justification-student'})
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose} >
                    { !!id && <JustificationWrapper  onCancel={onClose} justificationId={id} />}
        </ResponsiveModel>
    )
}