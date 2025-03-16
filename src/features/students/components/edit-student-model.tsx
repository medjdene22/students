'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { EditStudentWrapper } from "./edit-student-wrapper"

export default function EditStudentModel() {
    const { id, onClose } = useEditModel({ query: 'edit-student' });
    
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose}>
            {!!id && <EditStudentWrapper onCancel={onClose} studentId={id} />}
        </ResponsiveModel>
    );
}