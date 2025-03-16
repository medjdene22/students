'use client'
import { Button } from "@/components/ui/button"
import { useEditModel } from "@/hooks/use-edit-model"
import { PencilIcon } from "lucide-react"
import { useGetGroupId } from "../hooks/use-group-id"


export const EditGroup = () => {

    const groupId = useGetGroupId()
    const { open } = useEditModel({query: 'edit-group'})

    const onClick = () => {
        open(parseInt(groupId))
    }
    return (
        <div className=" w-full lg:w-fit">
          <Button variant="secondary"  className="w-full lg:w-fit" onClick={onClick}>
              <PencilIcon className="size-4" />
              Edit group
          </Button>
        </div>
    )    
}