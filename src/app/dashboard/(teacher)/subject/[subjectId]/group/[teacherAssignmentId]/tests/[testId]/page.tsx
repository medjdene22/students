import StudentTestList from "@/features/test/components/student-test-list"
import TestEditModel from "@/features/test/components/test-edit-model"
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";
export default async function TestDetailsPage() {

    await RoleOnly({role: Role.TEACHER})
    
    return (
    <div className="p-6 space-y-4">
      <TestEditModel />
      <StudentTestList />
    </div>
  )
}