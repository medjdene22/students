import { StudentEventsList } from "@/features/teacher-user/components/student-events-list";
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";

export default async function Page() {

    await RoleOnly({role: Role.TEACHER})
    
    return (
        <div className="">
            <StudentEventsList />
        </div>
    )
}