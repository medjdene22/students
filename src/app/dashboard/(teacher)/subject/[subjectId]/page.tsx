import { SubjectComponent } from "@/features/teacher-user/components/subject-component";
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";

export default async function Page() {
    
    await RoleOnly({role: Role.TEACHER})
    return (
        <div>
            <SubjectComponent />
        </div>
    )
}