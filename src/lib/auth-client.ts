import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { Auth } from "./auth"


export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your auth server
    plugins: [
        // add your plugins here
        usernameClient(),
        adminClient(),
        inferAdditionalFields<Auth>()
    ]
})
