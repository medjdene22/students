'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Page() {

  const {data} = authClient.useSession();

  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date())
  console.log(date)
  
  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        }
      }
    })
  }

    
  return (
    <div>
      <h1>{JSON.stringify(data?.user)}</h1>
      <br />
      <Calendar initialFocus
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow"
    />
      
      <Button onClick={logout}>Logout</Button>

    </div>
  );
}