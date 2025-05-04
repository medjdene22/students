'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useEditModel } from "@/hooks/use-edit-model"
import { JustificationWrapper } from "./justification-Wrapper"
import { Role } from "@/lib/types";
import { JustificationVerifyForm } from "./justification-verify-Wrapper";

export default function JustificationModel({role}:{role:Role}) {

    const { id, onClose } = useEditModel({ query: 'justification'})
    return (
        <ResponsiveModel isOpen={!!id} onOpencChange={onClose} >
                    {(role!==Role.STUDENT && !!id ) && <JustificationVerifyForm onCancel={onClose}  justificationId={id} role={role} />}
                    {(role===Role.STUDENT && !!id ) && <JustificationWrapper  onCancel={onClose} justificationId={id} />}
        </ResponsiveModel>
    )
}