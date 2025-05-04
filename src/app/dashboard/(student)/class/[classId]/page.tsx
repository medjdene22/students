import AppealModel from "@/features/justification/components/appeal-model";
import { StudentAttendanceList } from "@/features/student-user/components/student-attendance-list";
import { StudentAttendanceSummary } from "@/features/student-user/components/student-attendance-summary";
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";

export default async function Page() {

    await RoleOnly({role: Role.STUDENT})
    
    return (
        <div className="flex flex-col gap-4 ">
            <AppealModel />
            <StudentAttendanceSummary />
            <StudentAttendanceList />
        </div>
    )
}