import Link from "next/link";
import { StudentSubjectsSwitcher } from "./student-subjects-switcher";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Send} from 'lucide-react';

export const StudentNav = () => {   

    const pathname = usePathname();
    const fullHerf = `/dashboard/justifications`;
    const isactive = (pathname+'') === fullHerf
    
    return (
        <SidebarGroup className="px-0">
            <SidebarGroupContent>
                <SidebarMenu className="border-t group-data-[collapsible=icon]:border-none">
                    <StudentSubjectsSwitcher />

                    <SidebarMenuItem className={cn("group-data-[collapsible=icon]:hidden m-2  w-[95%] font-medium transition ", isactive && "bg-white border rounded-md text-black font-semibold")}>
                        <SidebarMenuButton asChild>
                            <Link href={fullHerf} className="flex items-center gap-2.5 p-2.5 ">
                                    <Send className="size-5 " />
                                    Justifications
                                
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}