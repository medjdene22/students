'use client'
import ResponsiveModel from "@/components/responsive-model"
import { useTestEditModel } from "../hooks/use-test-edit-model"
import { TestEditDialog } from "./test-edit-dialog"

export default function TestEditModel() {
    const { test, onClose } = useTestEditModel();
    
    return (
        <ResponsiveModel isOpen={!!test} onOpencChange={onClose}>
            <TestEditDialog />
            
        </ResponsiveModel>
    )
}
