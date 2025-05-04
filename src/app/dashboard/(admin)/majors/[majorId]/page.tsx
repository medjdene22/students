import { MajorSwitcher } from "@/features/major/components/major-switcher";
import SpecialtiesList from "@/features/specialtie/components/specialties-list";
import { EditMajor } from "@/features/major/components/edit-major";
import { RoleOnly } from "@/lib/role-only";
import { Role } from "@/lib/types";

export default async function Page() {

      await RoleOnly({role: Role.ADMIN})
                   
    
  return (
    <div className="flex flex-col gap-y-4">

      <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
        <MajorSwitcher />
        <EditMajor />
      </div>
      <SpecialtiesList />
    </div>
  )
}
