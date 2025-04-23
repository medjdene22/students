"use client"

import {ChevronsUpDown} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTeacherSubjectId } from "../hooks/use-teacher-subject-id"
import { useRouter } from "next/navigation"
import { useGetTeacherGroups } from "../api/use-get-groups"
import { useTeacherAssignmentId } from "../hooks/use-teacher-assignment-id"
import MajorAvatar from "@/features/student-group/components/major-avatar"

export function TeacherGroupsSwitcher() {

  const teacherSubjectId = Number(useTeacherSubjectId())
  
  const { data: teacherGroups } = useGetTeacherGroups({ specialtySubjectId: teacherSubjectId })
  const teacherAssignmentId = useTeacherAssignmentId()
  // console.log(teacherAssignmentId)

  const selectedteacherGroup = 
  teacherGroups?.find(teacherGroup => teacherGroup.teacherAssignmentId === Number(teacherAssignmentId)) 
    ?? {
      teacherAssignmentId: 0,
      groupId: 0,
      groupName: "select a group",
      assignment: "" ,
  }

  const { isMobile } = useSidebar()
  const router = useRouter()

  const handelOnClick = (teacherAssignmentId :number) => {
    router.push(`/dashboard/subject/${teacherSubjectId}/group/${teacherAssignmentId}`)
  }
  return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground m-2 w-[95%]"
            >
              <MajorAvatar name={selectedteacherGroup?.groupName || ""} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{"group : "+selectedteacherGroup?.groupName || "group name"}</span>
                <span className="truncate text-xs">{"assignment : "+selectedteacherGroup?.assignment}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Groups
            </DropdownMenuLabel>
            <div className="max-h-96 overflow-y-auto py-1">
              {teacherGroups?.map(teacherGroup => (
                <DropdownMenuItem 
                  key={teacherGroup.teacherAssignmentId}
                  className="gap-2 p-2"
                  onClick={() => handelOnClick(teacherGroup.teacherAssignmentId)}
                >
                  <MajorAvatar name={teacherGroup?.groupName || ""} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{"group : "+teacherGroup?.groupName || "group name"}</span>
                    <span className="truncate text-xs">{"assignment : "+teacherGroup?.assignment}</span>
                  </div>
                </DropdownMenuItem>
              ))}  
            </div>
          </DropdownMenuContent>  
        </DropdownMenu>
      </SidebarMenuItem>
  )
}
