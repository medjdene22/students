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

import MajorAvatar from "@/features/major/components/major-avatar"
import { useRouter } from "next/navigation"

import { useCreateModel } from "@/hooks/use-create-model"
import { useSpecialtieId } from "@/features/specialtie/hooks/use-specialtie-id"
import { useGetGroupId } from "../hooks/use-group-id"
import { useGetGroupsBySpecialty } from "../api/use-get-groups-by-specialty"
import { useMajorId } from "@/features/major/hooks/use-major-id"

export function GroupSwitcher() {


  const router = useRouter()

  const majorId = useMajorId()
  const groupId = useGetGroupId()
  const specialtyId = useSpecialtieId()


  const {data: groups}  = useGetGroupsBySpecialty({specialtyId});

  const { open } = useCreateModel({query: "create-group"});

  const groupSelectedId = groups?.find((group) => group.id.toString() === groupId) ?? groups?.[0]

  const onSelect = (group: typeof groupSelectedId) => {

    router.push(`/dashboard/majors/${majorId}/specialties/${group?.specialtyId}/groups/${group?.id}`) 
  }

  return (
      <div className="w-full lg:w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger className="peer/menu-button flex w-full items-center gap-4 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]" >

              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <MajorAvatar name={groupSelectedId?.name || ''}  />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {groupSelectedId?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            // side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Groups
            </DropdownMenuLabel>
            {groups?.map((group) => (
              <DropdownMenuItem
                key={group.name}
                onClick={() => onSelect(group)}
                className="gap-4 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <MajorAvatar name={group?.name || ''}  />
                </div>
                {group.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={open}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add group</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}
