import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { Auth } from "./auth"


export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL, // the base url of your auth server
    plugins: [
        // add your plugins here
        usernameClient(),
        adminClient(),
        inferAdditionalFields<Auth>()
    ]
})
