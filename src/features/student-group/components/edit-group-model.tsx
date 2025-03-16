'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { EditGroupWrapper } from "./edit-group-wrapper"


export default function EditGroupModel() {

    const { id, onClose } = useEditModel({ query: 'edit-group' });
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose} >
                    {!!id && <EditGroupWrapper  onCancel={onClose} groupId={id} />}
        </ResponsiveModel>
    )
}