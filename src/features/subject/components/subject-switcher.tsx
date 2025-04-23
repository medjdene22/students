"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useGetSubjects } from "@/features/subject/api/use-get-subjects"
import SubjectAvatar from "@/features/subject/components/subject-avatar"
import { useSubjectId } from "@/features/subject/hooks/use-subject-id"
import { useRouter } from "next/navigation"
import { useCreateModel } from "@/hooks/use-create-model"

export function SubjectSwitcher() {
  const router = useRouter()
  
  const subjectId = useSubjectId()
  const {data: subjects} = useGetSubjects();

  const { open } = useCreateModel({query: "create-subject"});

  const subjectSelectedId = subjects?.find((subject) => subject.id.toString() === subjectId) 

  const onSelect = (subjectId: number) => {
    router.push(`/dashboard/subjects/${subjectId}`)
  }

  return (
    <div className="w-full lg:w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger className="peer/menu-button flex w-full items-center gap-4 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]">

              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <SubjectAvatar name={subjectSelectedId?.name || 'S'}  />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {subjectSelectedId?.name || 'select a subject'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
            Subjects
            </DropdownMenuLabel>

            <div className="max-h-[200px] overflow-y-auto py-1">
            {subjects?.map((subject) => (
              <DropdownMenuItem
                key={subject.name}
                onClick={() => onSelect(subject.id)}
                className="gap-4 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <SubjectAvatar name={subject?.name || ''} />
                </div>
                {subject.name}
              </DropdownMenuItem>
            ))}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={open}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add subject</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}