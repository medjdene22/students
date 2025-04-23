"use client"

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { CalendarX2, ClipboardCheck, MoreHorizontal, Stethoscope } from 'lucide-react'
import { useCreateTestEvent } from '../api/use-create-test-event'
import { useDeleteTestEvent } from '../api/use-delete-test-event'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useTeacherAssignmentId } from '@/features/teacher-user/hooks/use-teacher-assignment-id'
import { useTestId } from '../hooks/use-test-id'

interface StudentTestActionProps {
  studentId: string
  studentName: string
  eventId?: string
  currentStatus: string
  isDisabled?: boolean
}

export const StudentTestAction = ({
  studentId,
  studentName,
  eventId,
  currentStatus,
  isDisabled = false
}: StudentTestActionProps) => {
  const { mutate: createEvent } = useCreateTestEvent()
  const { mutate: deleteEvent } = useDeleteTestEvent()

  const teacherAssignmentId = useTeacherAssignmentId()
  const testId = useTestId()

  // Helper to determine if the current status matches the event type
  const isCurrentStatus = (status: string) => currentStatus === status

  // Handle marking student as absent
  const handleAbsence = () => {
    if (isDisabled) {
      toast.error(`Cannot change status for excluded student ${studentName}`)
      return
    }

    createEvent({
      param: {
        teacherAssignmentId,
        testId
      },
      json: {
        studentId,
        event: 'absence'
      }
    })
  }

  // Handle marking student as present (removing absence)
  const handlePresent = () => {
    if (isDisabled) {
      toast.error(`Cannot change status for excluded student ${studentName}`)
      return
    }

    if (currentStatus !== 'taken' && eventId) {
      console.log(eventId)
      deleteEvent({
        param: {
            teacherAssignmentId,
            testId,
            eventId  
        }
      })
    }
  }

  return (
    <div className='flex justify-end'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className="size-8 p-0" disabled={isDisabled}>
            <MoreHorizontal className='size-4'/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem
            onClick={handlePresent}
            className={`p-2.5 font-medium ${isCurrentStatus('taken') ? 'bg-muted/50' : ''}`}
            disabled={isDisabled || isCurrentStatus('taken')}
          >
            <ClipboardCheck className='size-4 stroke-2 mr-1'/> Mark Present
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleAbsence}
            className={`p-2.5 font-medium ${isCurrentStatus('absence') ? 'bg-muted/50' : ''}`}
            disabled={isDisabled || isCurrentStatus('absence')}
          >
            <CalendarX2 className='size-4 stroke-2 mr-1'/> Mark Absent
          </DropdownMenuItem>

         
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
