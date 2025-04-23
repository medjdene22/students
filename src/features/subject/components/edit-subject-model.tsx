'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { EditSubjectWrapper } from "./edit-subject-wrapper"

export default function EditSubjectModel() {
    const { id, onClose } = useEditModel({ query: 'edit-subject'})
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose} >
            {!!id && <EditSubjectWrapper subjectId={id} onCancel={onClose} />}
        </ResponsiveModel>
    )
}