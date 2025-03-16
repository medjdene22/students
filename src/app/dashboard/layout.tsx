import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="min-h-screen ">
      <AppSidebar />
      <SidebarInset className="mx-auto  h-full w-full">
          <Header />
          <main className="h-full py-4 px-6 flex flex-col"> 
              {children}
          </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
