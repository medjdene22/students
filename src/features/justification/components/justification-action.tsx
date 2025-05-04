'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from "lucide-react"
import { useDeleteJustification } from "../api/use-delete-justification"
import { useEditModel } from "@/hooks/use-edit-model"
import { Justification } from "@/lib/types"


export const JustificationAction = ({ justification}: {justification: Justification}) => {
    const { status } = justification
    const { mutate: deleteJustification, isPending } = useDeleteJustification()

    const {open } = useEditModel({query: 'justification'})

    const handleOpen = () => {
        open(justification.justificationId)
    }

    const handleDelete = () => {
        deleteJustification({
            param: {
                justificationId: justification.justificationId.toString()
            }
        })
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={isPending} onClick={handleOpen}>Open Justification</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={isPending || status !== 'pending'} onClick={handleDelete}>Delete Justification</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
    }
// export const JustificationAction = ({ justification}: {justification: any}) => {