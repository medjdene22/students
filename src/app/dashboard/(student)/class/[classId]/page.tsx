import AppealModel from "@/features/justification/components/appeal-model";
import { StudentAttendanceList } from "@/features/student-user/components/student-attendance-list";
// import { StudentAttendanceSummary } from "@/features/student-user/components/student-attendance-summary";


export default function Page() {
    
    return (
        <div className="flex flex-col gap-4 ">
            <AppealModel />
            {/* <StudentAttendanceSummary /> */}
            <StudentAttendanceList />
        </div>
    )
}