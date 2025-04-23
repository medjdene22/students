"use client"

import { ChevronsUpDown } from "lucide-react"

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
import { useStudentSubjectId } from "../hooks/use-student-class-id"
import { useGetStudentSubjects } from "../api/use-get-student-subjects"
import SubjectAvatar from "@/features/subject/components/subject-avatar"
import { useRouter } from "next/navigation"

export function StudentSubjectsSwitcher() {
  
  const { data: studentSubjects } = useGetStudentSubjects()

  const subjectId = useStudentSubjectId()
  const selectedSubject = 
    studentSubjects?.find(subject => subject.id === Number(subjectId)) 
    ?? 
      {
        id: 0,
        subjectId: 0,
        subjectName: "Select a subject",
        year: "",
    }

  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleClick = (subjectId: number) => {
    router.push(`/dashboard/class/${subjectId}`)
  }
  
  return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground m-2 w-[95%]"
            >
              <SubjectAvatar name={selectedSubject?.subjectName || ""} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{selectedSubject?.subjectName || "Subject name"}</span>
                <span className="truncate text-xs">Year: {selectedSubject?.year}</span>
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
              Your Subjects
            </DropdownMenuLabel>
            <div className="max-h-96 overflow-y-auto py-1">
              {studentSubjects?.map(subject => (
                <DropdownMenuItem 
                  key={subject.id}
                  className="gap-2 p-2"
                  onClick={() => handleClick(subject.id)}
                >
                  <SubjectAvatar name={subject.subjectName || ""} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{subject.subjectName || "Subject name"}</span>
                    <span className="truncate text-xs">Year: {subject.year}</span>
                  </div>
                </DropdownMenuItem>
              ))}  
            </div>
          </DropdownMenuContent>  
        </DropdownMenu>
      </SidebarMenuItem>
  )
}