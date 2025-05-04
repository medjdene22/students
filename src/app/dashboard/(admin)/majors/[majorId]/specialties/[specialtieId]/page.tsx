import { MajorSwitcher } from "@/features/major/components/major-switcher";
import { SpecialtieSwitcher } from "@/features/specialtie/components/specialtie-switcher";
import { EditSpecialtie } from "@/features/specialtie/components/edit-specialtie";
import GroupList from "@/features/student-group/components/group-list";
import SpecialtySubjectsList from "@/features/specialtie/components/subjects-list";
import { RoleOnly } from "@/lib/role-only";
import { Role } from "@/lib/types";


export default async function Page() {

      await RoleOnly({role: Role.ADMIN})
                    
    
  return (
    <div className="flex flex-col gap-y-4">

      <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
        
        <div className="flex gap-x-4 w-full">
          <MajorSwitcher />
          <SpecialtieSwitcher />
        </div>
        
        <EditSpecialtie />
      </div>
      <GroupList />

      <SpecialtySubjectsList />
    </div>
  )
}
