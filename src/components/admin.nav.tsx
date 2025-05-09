
import { ChevronRight, UsersRound, Microscope, BookText } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {

    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useGetMajors } from "@/features/major/api/use-get-majors"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"





    

export function AdminNav() {

    const pathname = usePathname();
    const {data: majors} = useGetMajors(); 
    const router = useRouter();

    const isInMajors = pathname.includes("/dashboard/majors");

    const isInMajorsActive = pathname === `/dashboard/majors`;

    const isSubjectsActive = pathname.includes("/dashboard/subjects");

    const isTeachersActive = pathname.includes("/dashboard/teachers");

  return (
    <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
            <Collapsible 
            asChild
            className="group/collapsible"
            defaultOpen= {true}
            >
                <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip='Majors' className={cn("font-semibold", isInMajorsActive && "bg-black rounded-md font-semibold text-white", isInMajors && "group-data-[collapsible=icon]:bg-black group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:text-white font-semibold")} >
                        <Microscope onClick={() => {router.push("/dashboard/majors")}} className="mr-2 h-4 w-4" />
                        <span>Majors</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {majors?.map((major) => {
                            
                            const fullHerf = `/dashboard/majors/${major.id}`;
                            const isActive = pathname.includes(fullHerf);
                            return (
                            <SidebarMenuSubItem key={major.id} >
                                <SidebarMenuSubButton asChild className={cn("font-semibold pl-4", isActive && "bg-black rounded-md text-white font-semibold")}>
                                    <Link href={fullHerf}>
                                        {major.name}
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        )})}

                        

                    </SidebarMenuSub>
                </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        
            <SidebarMenuItem  >
                    <SidebarMenuButton tooltip='Teachers' asChild className={cn("font-semibold ", isTeachersActive && "bg-black rounded-md text-white font-semibold")}>
                        <Link href={`/dashboard/teachers`}>
                            <UsersRound className="mr-2 h-4 w-4 " />
                            Teachers
                        </Link>
                    </SidebarMenuButton>
            </SidebarMenuItem> 

            <SidebarMenuItem  >
                    <SidebarMenuButton tooltip='Subjects' asChild className={cn("font-semibold ", isSubjectsActive && "bg-black rounded-md text-white font-semibold")}>
                        <Link href={`/dashboard/subjects`}>
                            <BookText className="mr-2 h-4 w-4" />
                            Subjects
                        </Link>
                    </SidebarMenuButton>
            </SidebarMenuItem>

        </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
  )
    
}  