import { MajorSwitcher } from "@/features/major/components/major-switcher";
import SpecialtiesList from "@/features/specialtie/components/specialties-list";
import { EditMajor } from "@/features/major/components/edit-major";
import { adminOnly } from "@/lib/admin-only";


export default async function Page() {

      await adminOnly() 
                   
    
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
