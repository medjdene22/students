import { AppSidebar } from "@/components/app-sidebar"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserButton } from "@/features/auth/component/user-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="min-h-screen ">
      <AppSidebar />
      <SidebarInset className="mx-auto  h-full w-full">
          <header className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-10" />
              <div className="flex-col hidden lg:flex">
                  <h1 className="text-2xl font-semibold">Home</h1>
                  <p className="text-muted-foreground">Montor all of your teachers and students</p>
              </div>
            </div>
            
            <UserButton />
          </header>
          <main className="h-full py-8 px-6 flex flex-col"> 
              {children}
          </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
