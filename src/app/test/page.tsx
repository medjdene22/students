'use client'
import { Button } from "@/components/ui/button";
import { useGetMajors } from "@/features/major/api/use-get-majors";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Page() {

  const {data} = authClient.useSession();
  const {data: majors} = useGetMajors();

  const router = useRouter();

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
      <h1>{JSON.stringify(majors)}</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}