'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { EditTeacherWrapper } from "./edit-teacher-wrapper"

export default function EditTeacherModel() {
    const { id, onClose } = useEditModel({ query: 'edit-teacher' });
    
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose}>
            {!!id && <EditTeacherWrapper onCancel={onClose} teacherId={id} />}
        </ResponsiveModel>
    );
}