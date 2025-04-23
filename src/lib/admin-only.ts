import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { Role } from "./types";


export const adminOnly = async () => {
    const session = await auth.api.getSession({headers: await headers()})
    const user = session?.user
    if (!user || user.role !== Role.ADMIN) {
        redirect('/login')
    }
};