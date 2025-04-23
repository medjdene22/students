'use client'
import { Button } from "@/components/ui/button"
import { useEditModel } from "@/hooks/use-edit-model"
import { PencilIcon } from "lucide-react"
import { useSubjectId } from "../hooks/use-subject-id"

export const EditSubject = () => {
    const subjectId = useSubjectId()
    const { open } = useEditModel({query: 'edit-subject'})
    
    const onClick = () => {
        open(parseInt(subjectId))
    }
    
    return (
        <div className="w-full lg:w-fit">
          <Button variant="secondary" className="w-full lg:w-fit" onClick={onClick}>
              <PencilIcon className="size-4" />
              Edit subject
          </Button>
        </div>
    )
}