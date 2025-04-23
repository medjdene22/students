"use client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { TrashIcon } from 'lucide-react'
import { useConfirm } from '@/hooks/use-conform'
import { useDeleteSubjectFromSpecialty } from '../api/use-delete-subject-from-specialty'

export const SubjectAction = ({id, children} : {id : number, children: React.ReactNode}) => {

    const { mutate } = useDeleteSubjectFromSpecialty();
    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to remove this subject from the specialty",
        'destructive'
    );

    const handleDelete = async () => {
        const confirmed = await confirm();
        if (!confirmed) {
            return;
        }
        const idToDelete = id.toString();
        mutate({param: {id: idToDelete}});
    }

    return (
        <div className='flex justify-end'>
            <ConfirmationDialog/>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                    <DropdownMenuItem 
                    onClick={handleDelete}
                    className='p-2.5 focus:text-amber-700 text-amber-700 font-medium'>
                        <TrashIcon className='size-4 mr-1'/> Remove subject
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}