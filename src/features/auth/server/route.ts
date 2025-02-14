import { auth } from "@/lib/auth";
import { AdditionalContext } from "@/lib/session-middleware";
import { emailPattern, LoginSchema } from "@/lib/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono<AdditionalContext>()
    .get("/", async (c) => {
        const user = c.get("user")
        const session = c.get("session")
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        console.log(user)
        return c.json({ user, session })
    })
    .post("/", zValidator('json', LoginSchema), async (c) => {
        const { id, password } = c.req.valid('json')
        const isEmail = emailPattern.test(id)
        try {
            if (isEmail) {
                await auth.api.signInEmail({
                    body: {
                        email: id,
                        password: password
                    },
                    headers: c.req.raw.headers,
                })
            } else {
                await auth.api.signInUsername({
                    body: {
                        username: id,
                        password: password
                    },
                    headers: c.req.raw.headers,
                })
                return c.json({ seccess: "login success", })
            }
            

    } catch {

        return c.json({ error: "login failed" }, 401);
    }   
        
    })



export default app