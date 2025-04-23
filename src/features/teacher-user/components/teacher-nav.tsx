
import { TeacherGroupsSwitcher } from "@/features/teacher-user/components/teacher-groups-switcher"
import { TeacherSubjectsSwitcher } from "@/features/teacher-user/components/teacher-subjects-switcher"
import { CalendarNav } from "../../../components/calander"
import { SidebarGroup, SidebarGroupContent, SidebarMenu} from "../../../components/ui/sidebar"
import { useTeacherAssignmentId } from "@/features/teacher-user/hooks/use-teacher-assignment-id"
import { useTeacherSubjectId } from "@/features/teacher-user/hooks/use-teacher-subject-id"

export const TeacherNav = () => {   
    const subject = isNaN(Number(useTeacherSubjectId()))
    const group =isNaN(Number(useTeacherAssignmentId()))
    return (
        <SidebarGroup className="p-0">
        <SidebarGroupContent >

        <SidebarMenu className="border-y group-data-[collapsible=icon]:border-none">
            <TeacherSubjectsSwitcher  />
            { !subject && <TeacherGroupsSwitcher  /> }
        </SidebarMenu>

        {!group && <CalendarNav />}
            
        </SidebarGroupContent>
        </SidebarGroup>
    )
}