import { ClassroomAttendance } from "@/features/teacher-user/components/classroom-attendance";
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";

export default async function Page() {

    await RoleOnly({role: Role.TEACHER})

        return (
        <div>
            <ClassroomAttendance />

        </div>
    )
}