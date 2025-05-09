"use client"

import {Loader, LogOut, Settings } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dotted } from "@/components/dotted"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"



export const UserButton = () => {

    const router = useRouter();
    const queryClient = useQueryClient();
    
    const logout = () => {
        authClient.signOut({
            fetchOptions:{
                onSuccess:() => {
                    router.push("/login");
                    toast.success("Logout successful");
                    queryClient.invalidateQueries();
                    queryClient.clear();
                },
                onError: ({error}) => {
                    toast.error(error.message);
                }    
            }
        })
    }
    const {data, isPending} = authClient.useSession();

    if (isPending) {
        return (
        <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
            <Loader className="size-4 animate-spin text-muted-foreground"/>
        </div>
    )}
    const user = data?.user;
    if (!user) return null
    
    const { name, email} = user;
    const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() ?? "U";
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition-opacity border border-neutral-300">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-60 rounded-xl bg-white p-2 shadow-md " sideOffset={10}>
                <div className="flex items-center flex-col justify-center gap-2 px-2.5 py-4 cursor-pointer">
                    <Avatar className="size-[52px] border border-neutral-300">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-neutral-900">
                            {name || "user"}
                        </p>
                        <p className="text-xs text-neutral-500">
                            {email || "user email"}
                        </p>
                    </div>
                </div>
                <Dotted className="mb-1  " />
                <DropdownMenuItem onClick={() => logout()} className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer">
                        <LogOut className="size-4"/>
                        <span>Logout</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="h-10 flex items-center justify-center font-medium cursor-pointer">
                            <Settings className="size-4"/>
                            <span>Settings</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}