import { db } from "@/db"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, openAPI, username } from "better-auth/plugins"
 
export const auth = betterAuth({
    database: drizzleAdapter(db ,{
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,

    },
    plugins: [ 
        openAPI(),
        username(), 
        admin()
    ] ,
    trustedOrigins:['http://192.168.0.100:3000']
})

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
