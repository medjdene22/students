
import { ChevronRight, UsersRound,Command, icons } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {

    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const adminNav = [
    {
        title: 'Students',
        icon: UsersRound,
        routes: [
            {
              href: '/dashboard/majors',
              label: 'Majors'
            },
            {
              href: '/dashboard/specialties',
              label: 'Specialties'
            },
            {
              href: '/dashboard/groups',
              label: 'Groups'
            },
            {
                href: '/dashboard/students',
                label: 'Students'
            },
        ]
    },
    {
        title: 'Subjects',
        icon: Command,
        routes: [
            {
              href: '/dashboard/teachers',
              label: 'Teachers'
            },
            {
              href: '/dashboard/subjects',
              label: 'Subjects'
            },
        ]
    }
]



    

export function AdminNav() {
  return (
    <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu className="space-y-1">
        {adminNav.map((nav) => (
            <Collapsible 
            asChild
            className="group/collapsible"
            key={nav.title}
            defaultOpen= {true}
            >
                <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={nav.title}>
                    {nav.icon &&<nav.icon className="mr-2 h-4 w-4" />}
                    <span>{nav.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {nav.routes.map((route) => (
                            <SidebarMenuSubItem key={route.href}>
                                <SidebarMenuSubButton asChild>
                                    <Link href={route.href}>
                                        {route.label}
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                        

                    </SidebarMenuSub>
                </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        ))}
        
        </SidebarMenu>
      </SidebarGroup>
  )
    
}  