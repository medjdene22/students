"use client"

import {
  GraduationCap,
  Command,
  UserRound
} from "lucide-react"
import { usePathname } from "next/navigation";
import { Send} from 'lucide-react';
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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

    const pathname = usePathname();
    const fullHerf = `/dashboard/justifications`;
    const isactive = (pathname+'') === fullHerf

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

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:border-none">

              <SidebarMenuItem >
                  <SidebarMenuButton asChild className={cn("  font-medium ", isactive && "bg-black rounded-md text-white font-semibold")}>
                      <Link href={fullHerf} className="flex items-center gap-2.5 p-2.5 ">
                              <Send className="size-5 " />
                              Justifications
                          
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
