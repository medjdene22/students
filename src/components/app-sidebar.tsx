"use client"

import * as React from "react"
import {
  GraduationCap,
  Command,
  UserRound
} from "lucide-react"

// import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client";
import { Role } from "@/lib/types";
import Link from "next/link"
import { AdminNav } from "./admin.nav"
import { TeacherNav } from "../features/teacher-user/components/teacher-nav";
import { StudentNav } from "@/features/student-user/components/student-nav";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const user = authClient.useSession().data?.user
    const role = user?.role

    return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  
                  { role === Role.ADMIN && <Command className="h-6 w-6" />}
                  { role === Role.TEACHER && <GraduationCap className="h-6 w-6" />}
                  { role === Role.STUDENT && <UserRound className="h-6 w-6" />}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Student Attendence</span>
                  <span className="truncate text-xs">{role}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
      </SidebarHeader>
      <SidebarContent>
        {role===Role.ADMIN && (<AdminNav />)}
        {role===Role.TEACHER && (<TeacherNav />)}
        {role===Role.STUDENT && (<StudentNav />)}
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
