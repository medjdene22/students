'use client'
import { Button } from "@/components/ui/button"
import { useEditModel } from "@/hooks/use-edit-model"
import { PencilIcon } from "lucide-react"
import { useMajorId } from "../hooks/use-major-id"


export const EditMajor = () => {

    const majorId = useMajorId()
    const { open } = useEditModel({query: 'edit-major'})
    const onClick = () => {
        open(parseInt(majorId))
    }
    return (
        <div className=" w-full lg:w-fit">
          <Button variant="secondary"  className="w-full lg:w-fit" onClick={onClick}>
              <PencilIcon className="size-4" />
              Edit major
          </Button>
        </div>
    )    
}