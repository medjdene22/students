import { StudentSubjectsSwitcher } from "./student-subjects-switcher";
import { SidebarGroup, SidebarGroupContent, SidebarMenu  } from "@/components/ui/sidebar";

export const StudentNav = () => {   
    
    return (
        <SidebarGroup className="px-0">
            <SidebarGroupContent>
                <SidebarMenu className="border-t group-data-[collapsible=icon]:border-none">
                    <StudentSubjectsSwitcher />

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}