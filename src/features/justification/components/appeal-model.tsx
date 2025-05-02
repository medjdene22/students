'use client'
import ResponsiveModel from "@/components/responsive-model"
import { AppealWrapper } from "./appeal-Wrapper"
import { useJustificationmodel } from "../hooks/use-justification-hook"
// import { EditMajorWrapper } from "./edit-major-wrapper"


export default function AppealModel() {

    const { eventId, isOpen, type, onClose } = useJustificationmodel()
    return (
        <ResponsiveModel isOpen={isOpen} onOpencChange={onClose} >
                    { isOpen && <AppealWrapper  onCancel={onClose} eventId={eventId.toString()} type={type} />}
        </ResponsiveModel>
    )
}