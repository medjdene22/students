import { StudentSubjectsSwitcher } from "./student-subjects-switcher";
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";

export const StudentNav = () => {   
    return (
        <SidebarGroup className="p-0">
            <SidebarGroupContent>
                <SidebarMenu className="border-y group-data-[collapsible=icon]:border-none">
                    <StudentSubjectsSwitcher />
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}