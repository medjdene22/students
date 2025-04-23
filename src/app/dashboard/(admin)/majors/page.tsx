
import MajorsList from "@/features/major/components/majors-list";
import { adminOnly } from "@/lib/admin-only";

export default async function Page() {

    await adminOnly() 


  return (
    <div>
      
      <MajorsList />
    </div>
  )
}