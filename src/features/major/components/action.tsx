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
import { useDeleteMajor } from '../api/use-delete-major'
import { useRouter } from 'next/navigation'
import { useEditModel } from '@/hooks/use-edit-model'

export const Action = ({id, children} : {id : number, children: React.ReactNode}) => {

    const { mutate, isPending } = useDeleteMajor();
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this major", 'destructive');

    const router = useRouter();
    const { open } = useEditModel({query: "edit-major"});


    const handleOpenMajor = async () => {
        router.push(`/dashboard/majors/${id}`);
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
                onClick={handleOpenMajor}
                className='p-2.5 font-medium'>
                    <ExternalLinkIcon className='size-4 stroke-2 mr-1 '/> Open major
                </DropdownMenuItem>

                <DropdownMenuItem 
                onClick={handleEdit}
                className='p-2.5 font-medium'>
                    <PencilIcon className='size-4 stroke-2 mr-1'/> Edit major
                </DropdownMenuItem>

                <DropdownMenuItem 
                onClick={handleDelete}
                disabled={false}
                className='p-2.5 focus:text-amber-700 text-amber-700 font-medium'>
                    <TrashIcon className='size-4 mr-1'/> Delete major
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}