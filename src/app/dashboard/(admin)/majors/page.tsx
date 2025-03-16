import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import MajorsList from "@/features/major/components/majors-list";
import CreateMajorModel from "@/features/major/components/create-major-model";
import EditMajorModel from "@/features/major/components/edit-major-model";


export default async function Page() {

  const session = await auth.api.getSession({headers: await headers()})
  const user = session?.user
  if (!user) redirect('/login')


  return (
    <div>
      
      <MajorsList />
    </div>
  )
}