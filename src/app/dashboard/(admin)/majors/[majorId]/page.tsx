import { MajorSwitcher } from "@/features/major/components/major-switcher";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation'
import SpecialtiesList from "@/features/specialtie/components/specialties-list";
import { EditMajor } from "@/features/major/components/edit-major";


export default async function Page() {

    const session = await auth.api.getSession({headers: await headers()})
    const user = session?.user
    if (!user) redirect('/login')                
    
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
