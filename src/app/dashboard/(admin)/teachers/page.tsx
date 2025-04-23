
// import { HeaderTitle } from "@/components/header-title"
import TeachersList from "@/features/teachers/components/teachers-list"
import { adminOnly } from "@/lib/admin-only"

export default async function TeachersPage() {
  
  await adminOnly() 
    
  return (
      <div className="flex flex-col h-full">
        {/* <HeaderTitle title="Teachers" description="Manage teachers" /> */}
        <div className="flex-1">
          <TeachersList />
        </div>

      </div>
  )
}