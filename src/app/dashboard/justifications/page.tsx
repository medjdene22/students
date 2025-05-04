import { JustificationList } from "@/features/justification/components/justification-list";
import JustificationModel from "@/features/justification/components/justification-model";
import { JustificationToVerify } from "@/features/justification/components/justification-to-verify";
import { RoleOnly } from "@/lib/role-only";
import { Role } from "@/lib/types";

export default async function Page() {

  const user = await RoleOnly({})

  return (
    <div className="flex flex-col gap-4">

            {(user.role !== Role.STUDENT) && <JustificationToVerify role={user.role as Role} />}
            {user.role === Role.STUDENT && <JustificationList />}
            <JustificationModel role={user.role as Role} />
    </div>
  );
}