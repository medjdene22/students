import { MajorSwitcher } from "@/features/major/components/major-switcher";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation'

import { SpecialtieSwitcher } from "@/features/specialtie/components/specialtie-switcher";
import { EditSpecialtie } from "@/features/specialtie/components/edit-specialtie";
import GroupList from "@/features/student-group/components/group-list";


export default async function Page() {

    const session = await auth.api.getSession({headers: await headers()})
    const user = session?.user
    if (!user) redirect('/login')                
    
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
    </div>
  )
}
