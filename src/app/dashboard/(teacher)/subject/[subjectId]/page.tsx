import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";

export default async function Page() {
    
    await RoleOnly({role: Role.TEACHER})
    return (
        <div>
            Teacher Subject Page
        </div>
    )
}