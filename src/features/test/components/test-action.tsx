"use client"

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useConfirm } from '@/hooks/use-conform'
import { useDeleteTest } from '../api/use-delete-test'
import { useTestEditModel } from '../hooks/use-test-edit-model'
import { useTeacherAssignmentId } from "@/features/teacher-user/hooks/use-teacher-assignment-id";
import { useRouter } from 'next/navigation'
import { useTeacherSubjectId } from '@/features/teacher-user/hooks/use-teacher-subject-id'

interface TestActionProps {
  testId: number;
  testName: string;
  testDate: string;
  replacementDate: string | null | undefined;  
  children: React.ReactNode;
}

export const TestAction = ({ testId, testName, testDate, replacementDate, children }: TestActionProps) => {
  const { mutate } = useDeleteTest();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Test", 
    `Are you sure you want to delete "${testName}"?`,
    "destructive"
  );

  const teacherSubjectId = useTeacherSubjectId();
  const teacherAssignmentId = useTeacherAssignmentId();
  
  const { onOpen } = useTestEditModel();
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }
    
    mutate({
      param: {
        testId: testId.toString(),
        teacherAssignmentId
      }
    });
  }

  const handleEdit = () => {
    onOpen({
      id: testId,
      name: testName,
      testDate,
      teacherAssignmentId,
      replacementDate

    });
  }

  const handleOpen = () => {
    router.push(`/dashboard/subject/${teacherSubjectId}/group/${teacherAssignmentId}/tests/${testId}`)
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
            onClick={handleEdit}
            className='p-2.5 font-medium'
          >
            <PencilIcon className='size-4 stroke-2 mr-1'/> Edit test
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleDelete}
            className='p-2.5 focus:text-amber-700 text-amber-700 font-medium'
          >
            <TrashIcon className='size-4 mr-1'/> Delete test
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleOpen}
            className='p-2.5   font-medium'
          >
            <EyeIcon className='size-4 mr-1'/> View test
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
