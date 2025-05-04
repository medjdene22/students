import StudentList from "@/features/teacher-user/components/student-list";
import TestEditModel from "@/features/test/components/test-edit-model";
import TestList from "@/features/test/components/test-list";
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";



export default async function Page() {

    await RoleOnly({role: Role.TEACHER})
    
    return (
        <div className="space-y-4">
            <StudentList />
            <TestList />
            <TestEditModel />
        </div>  
    )
}