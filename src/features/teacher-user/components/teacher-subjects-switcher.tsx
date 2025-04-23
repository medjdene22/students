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
import { useGetTeacherSubjects } from "../api/use-get-subjects"
import SubjectAvatar from "@/features/subject/components/subject-avatar"
import { useRouter } from "next/navigation"

export function TeacherSubjectsSwitcher() {
  
  const { data: teacherSubjects } = useGetTeacherSubjects()
  const teacherSubjectId = useTeacherSubjectId()
  const selectedteacherSubject = 
    teacherSubjects?.find(teacherSubject => teacherSubject.specialtySubjectId === Number(teacherSubjectId)) 
    ?? 
      {
        subjectName: "select a subject ",
        specialtySubjectId: 0,
        specialtyName: '',
        year: "",
    }


  const { isMobile } = useSidebar()
  const router = useRouter()

  const handelOnClick = (teacherSubjectId :number) => {
    router.push(`/dashboard/subject/${teacherSubjectId}`)
  }
  return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground m-2 w-[95%]"
            >
              <SubjectAvatar name={selectedteacherSubject?.subjectName || ""} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{selectedteacherSubject?.subjectName || "subject name"}</span>
                <span className="truncate text-xs">{selectedteacherSubject?.specialtyName + " - " + selectedteacherSubject?.year + " year"}</span>
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
              Subjects
            </DropdownMenuLabel>
            <div className="max-h-96 overflow-y-auto py-1">
              {teacherSubjects?.map(teacherSubject => (
                <DropdownMenuItem 
                  key={teacherSubject.specialtySubjectId}
                  className="gap-2 p-2"
                  onClick={() => handelOnClick(teacherSubject.specialtySubjectId)}
                >
                  <SubjectAvatar name={teacherSubject.subjectName || ""} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{teacherSubject.subjectName || "subject name"}</span>
                    <span className="truncate text-xs">{teacherSubject.specialtyName + " - " + teacherSubject.year + " year"}</span>
                  </div>
                </DropdownMenuItem>
              ))}  
            </div>
          </DropdownMenuContent>  
        </DropdownMenu>
      </SidebarMenuItem>
  )
}
