
import MajorsList from "@/features/major/components/majors-list";
import { RoleOnly } from "@/lib/role-only";
import { Role } from "@/lib/types";

export default async function Page() {

    await RoleOnly({role: Role.ADMIN})


  return (
    <div>
      
      <MajorsList />
    </div>
  )
}