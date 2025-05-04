
// import { HeaderTitle } from "@/components/header-title"
import TeachersList from "@/features/teachers/components/teachers-list"
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";

export default async function TeachersPage() {
  
  await RoleOnly({role: Role.ADMIN})
    
  return (
      <div className="flex flex-col h-full">
        {/* <HeaderTitle title="Teachers" description="Manage teachers" /> */}
        <div className="flex-1">
          <TeachersList />
        </div>

      </div>
  )
}