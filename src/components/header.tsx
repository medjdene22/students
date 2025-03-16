'use client'
import { authClient } from "@/lib/auth-client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "./ui/sidebar"
import { UserButton } from "@/features/auth/component/user-button"
import { Role } from "@/lib/types"
import { usePathname } from "next/navigation"
import { is } from "drizzle-orm"


export default function Header(){
    const role = authClient.useSession().data?.user.role;
    const path = usePathname().split('/').slice(2)

    let isMajors = false
    let isMajor = false
    let isSpecialties = false
    let isGroups = false
    let isGroup = false

    if(path.includes('majors')){
        isMajors = true
        
        if(!isNaN(Number(path[1]))){
            isMajor = true

            if(path.includes('specialties')){
                isSpecialties = true

                if(!isNaN(Number(path[3]))){
      
                  if(path.includes('groups')){
                      isGroups = true
                  }
              }
            }
        }

        
    }

    return(
    <header className="p-3 flex items-center justify-between mr-2">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-10 hidden lg:flex" />
              { role === Role.ADMIN && (

                <div className="flex-col hidden lg:flex">
                  <h1 className="text-2xl font-semibold">{isMajors ? isMajor? isSpecialties? isGroups? 'Edit Group' : 'Edit Specialtie' : 'Edit Major' : 'Majors' : 'Home'}</h1>
                  <p className="text-muted-foreground">{isMajors ? isMajor? isSpecialties? isGroups? 'Edit group students and subjects' : 'Edit specialtie groups' : 'Edit major specialties' : 'Manage your majors' : 'Montor all of your teachers and students'}</p>
                </div>
              )}
            </div>
            
            <UserButton />
    </header>
    )
}