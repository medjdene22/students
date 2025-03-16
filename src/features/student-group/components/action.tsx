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
import { useDeleteGroup } from '../api/use-delete-group'
import { useMajorId } from '@/features/major/hooks/use-major-id'

export const Action = ({id, specialtyId, children}: {id: number, specialtyId: number, children: React.ReactNode}) => {

    const { mutate } = useDeleteGroup();
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this group", 'destructive');

    const router = useRouter();
    const { open } = useEditModel({ query: 'edit-group' });

    const majorId = useMajorId();


    const handleOpenGroup = async () => {
        router.push(`/dashboard/majors/${majorId}/specialties/${specialtyId}/groups/${id}`);
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
                onClick={handleOpenGroup}
                className='p-2.5 font-medium'>
                    <ExternalLinkIcon className='size-4 stroke-2 mr-1 '/> Open group
                </DropdownMenuItem>

                <DropdownMenuItem 
                onClick={handleEdit}
                className='p-2.5 font-medium'>
                    <PencilIcon className='size-4 stroke-2 mr-1'/> Edit group
                </DropdownMenuItem>

                <DropdownMenuItem 
                onClick={handleDelete}
                disabled={false}
                className='p-2.5 focus:text-amber-700 text-amber-700 font-medium'>
                    <TrashIcon className='size-4 mr-1'/> Delete group
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}