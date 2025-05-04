import { SubjectSwitcher } from "@/features/subject/components/subject-switcher";
import { EditSubject } from "@/features/subject/components/edit-subject";
import SubjectSpecialtiesList from "@/features/subject/components/specialties-list";
import { RoleOnly } from "@/lib/role-only"
import { Role } from "@/lib/types";
export default async function Page() {

  await RoleOnly({role: Role.ADMIN})    

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
        <SubjectSwitcher />
        <EditSubject />
      </div>
      <SubjectSpecialtiesList />
    </div>
  )
}
