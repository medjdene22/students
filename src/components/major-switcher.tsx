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
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useGetMajors } from "@/features/major/api/use-get-majors"
import MajorAvatar from "@/features/major/components/major-avatar"
import { useMajorId } from "@/features/major/hooks/use-major-id"
import { useRouter } from "next/navigation"
import { useCreateMajorModel } from "@/features/major/hooks/use-create-major-model"
import CreateMajorModel from "@/features/major/components/create-major-model"

export function MajorSwitcher() {


  const router = useRouter()
  const { isMobile } = useSidebar()
  const majorId = useMajorId()
  const {data: majors} = useGetMajors();

  const { open } = useCreateMajorModel()

  const majorSelectedId = majors?.find((major) => major.id.toString() === majorId) ?? majors?.[0]

  const onSelect = (majorId: string) => {
    router.push(`/dashboard/majors/${majorId}`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <CreateMajorModel />
        <DropdownMenu>
          <SidebarGroupLabel>Majors</SidebarGroupLabel>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <MajorAvatar name={majorSelectedId?.name || ''} image={''} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {majorSelectedId?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Groups
            </DropdownMenuLabel>
            {majors?.map((major) => (
              <DropdownMenuItem
                key={major.name}
                onClick={() => onSelect(major.id.toString())}
                className="gap-4 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <MajorAvatar name={major?.name || ''} image={''} />
                </div>
                {major.name}
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
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
