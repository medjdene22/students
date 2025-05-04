import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { Role } from "./types";


export const RoleOnly = async ({role}: {role?: Role}) => {
    const session = await auth.api.getSession({headers: await headers()})
    const user = session?.user
    if (!user || user.role !== role && !!role) {
        redirect('/login')
    }
    return user
};