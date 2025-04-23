import { StudentAttendanceList } from "@/features/student-user/components/student-attendance-list";
import { StudentAttendanceSummary } from "@/features/student-user/components/student-attendance-summary";


export default function Page() {
    
    return (
        <div>
            <StudentAttendanceList />
            <StudentAttendanceSummary />
        </div>
    )
}