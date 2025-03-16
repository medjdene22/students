'use client'
import { Button } from "@/components/ui/button"
import { useEditModel } from "@/hooks/use-edit-model"
import { PencilIcon } from "lucide-react"
import { useSpecialtieId } from "../hooks/use-specialtie-id"


export const EditSpecialtie = () => {

    const specialtieId = useSpecialtieId()
    const { open } = useEditModel({query: 'edit-specialtie'})
    const onClick = () => {
        open(parseInt(specialtieId))
    }
    return (
        <div className=" w-full lg:w-fit">
          <Button variant="secondary"  className="w-full lg:w-fit" onClick={onClick}>
              <PencilIcon className="size-4" />
              Edit specialtie
          </Button>
        </div>
    )    
}