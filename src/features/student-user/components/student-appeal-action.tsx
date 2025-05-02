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
import { ClipboardCheck, MoreHorizontal } from 'lucide-react'

import { StudentEvent } from './student-attendance-columns'
import { useJustificationmodel } from '@/features/justification/hooks/use-justification-hook'


export const StudentAppealAction = ( { EventToAppeal }: { EventToAppeal: StudentEvent }) => {

  const isDisabled = EventToAppeal.event !== 'absence'
  const { onOpen } = useJustificationmodel()
  

  const handleAppeal = () => {
    onOpen(EventToAppeal.id, EventToAppeal.type )
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
            onClick={handleAppeal}
            className={`p-2.5 font-medium `}
            disabled={isDisabled }
          >
            <ClipboardCheck className='size-4 stroke-2 mr-1'/> Appeal
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* <DropdownMenuItem
            onClick={handleAbsence}
            className={`p-2.5 font-medium ${isCurrentStatus('absence') ? 'bg-muted/50' : ''}`}
            disabled={isDisabled || isCurrentStatus('absence')}
          >
            <CalendarX2 className='size-4 stroke-2 mr-1'/> Mark Absent
          </DropdownMenuItem> */}

         
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
