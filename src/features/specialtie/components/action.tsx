"use-client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ExternalLinkIcon, PencilIcon,TrashIcon } from 'lucide-react'
import { useConfirm } from '@/hooks/use-conform'
import { useRouter } from 'next/navigation'
import { useEditModel } from '@/hooks/use-edit-model'
import { useDeleteSpecialtie } from '../api/use-delete-specialtie'

export const Action = ({id, majorId, children}: {id: number, majorId: number, children: React.ReactNode}) => {

    const { mutate } = useDeleteSpecialtie();
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this specialtie", 'destructive');

    const router = useRouter();
    const { open } = useEditModel({query: "edit-specialtie"});


    const handleOpenSpecialtie = async () => {
        router.push(`/dashboard/majors/${majorId}/specialties/${id}`);
    }

    const handleDelete = async () => {
        const confirmed = await confirm();
        if (!confirmed) {
            return;
        }
        const idToDelete = id.toString();
        mutate({param: {id: idToDelete}});
    }

    const handleEdit = async () => {
        open(id);
    }

  return (
    <div className='flex justify-end'>
        <ConfiramtionDialog/>

        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>

                <DropdownMenuItem 
                onClick={handleOpenSpecialtie}
                className='p-2.5 font-medium'>
                    <ExternalLinkIcon className='size-4 stroke-2 mr-1 '/> Open specialtie
                </DropdownMenuItem>

                <DropdownMenuItem 
                onClick={handleEdit}
                className='p-2.5 font-medium'>
                    <PencilIcon className='size-4 stroke-2 mr-1'/> Edit specialtie
                </DropdownMenuItem>

                <DropdownMenuItem 
                onClick={handleDelete}
                disabled={false}
                className='p-2.5 focus:text-amber-700 text-amber-700 font-medium'>
                    <TrashIcon className='size-4 mr-1'/> Delete specialtie
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}