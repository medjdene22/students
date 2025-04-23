
import SubjectsList from "@/features/subject/components/subjects-list";
import { adminOnly } from "@/lib/admin-only";

export default async function Page() {
    await adminOnly() 
  

  return (
    <div>
      <SubjectsList />
    </div>
  )
}
