
// import { HeaderTitle } from "@/components/header-title"
import TeachersList from "@/features/teachers/components/teachers-list"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function TeachersPage() {
  const session = await auth.api.getSession({headers: await headers()})
  const user = session?.user
  if (!user) redirect('/login')
    
  return (
      <div className="flex flex-col h-full">
        {/* <HeaderTitle title="Teachers" description="Manage teachers" /> */}
        <div className="flex-1">
          <TeachersList />
        </div>

      </div>
  )
}