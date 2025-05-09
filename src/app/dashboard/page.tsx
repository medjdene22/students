// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { HeaderTitle } from "@/components/header-title"
// import { GraduationCap, LayoutList, Book, UserCog } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useGetTeachersCount } from "@/features/teachers/api/use-get-teachers-count"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { StudentProfile } from "@/features/student-user/components/student-profile";
import { TeacherProfile } from "@/features/teacher-user/components/teacher-profile";

export default async function Page() {

  const session = await auth.api.getSession({headers: await headers()})
  const user = session?.user
  if (!user) redirect('/login')

  // const { data: teachersCount, isLoading: isLoadingTeachersCount } = useGetTeachersCount();
  if(user.role === "student") {
    return (
    <div>
        <StudentProfile />
    </div>
    ) 
  }else if(user.role === "teacher") {
    return (
    <div>
        <TeacherProfile />
    </div>
    )
  }else if(user.role === "admin") {
    redirect('/dashboard/majors')
  }
return (

    <div>
      DashBoard
    </div>
      //  <div className="flex flex-col h-full">
      //   {/* <HeaderTitle title="Dashboard" description="Overview of your system" /> */}
        
      //   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      //     <Card>
      //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      //         <CardTitle className="text-sm font-medium">
      //           Total Majors
      //         </CardTitle>
      //         <Book className="h-4 w-4 text-muted-foreground" />
      //       </CardHeader>
      //       <CardContent>
      //         <div className="text-2xl font-bold">2</div>
      //       </CardContent>
      //     </Card>
      //     <Card>
      //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      //         <CardTitle className="text-sm font-medium">
      //           Total Specialties
      //         </CardTitle>
      //         <LayoutList className="h-4 w-4 text-muted-foreground" />
      //       </CardHeader>
      //       <CardContent>
      //         <div className="text-2xl font-bold">3</div>
      //       </CardContent>
      //     </Card>
      //     <Card>
      //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      //         <CardTitle className="text-sm font-medium">Total Students</CardTitle>
      //         <GraduationCap className="h-4 w-4 text-muted-foreground" />
      //       </CardHeader>
      //       <CardContent>
      //         <div className="text-2xl font-bold">+12</div>
      //       </CardContent>
      //     </Card>
      //     <Card>
      //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      //         <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
      //         <UserCog className="h-4 w-4 text-muted-foreground" />
      //       </CardHeader>
      //       <CardContent>
      //         <div className="text-2xl font-bold">
      //           {isLoadingTeachersCount ? "..." : teachersCount || 0}
      //         </div>
      //       </CardContent>
      //     </Card>
      //   </div>
        
      // </div>
  )
}


  
