
import SubjectsList from "@/features/subject/components/subjects-list";
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";
export default async function Page() {

  await RoleOnly({role: Role.ADMIN})  

  return (
    <div>
      <SubjectsList />
    </div>
  )
}
