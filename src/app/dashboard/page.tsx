import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth.api.getSession({headers: await headers()})
  const user = session?.user
  if (!user) redirect('/login')
  return (
    <div>dashBoard</div>
  )
}
