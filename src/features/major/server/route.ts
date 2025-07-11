import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/db"
import { insertMajorSchima, major } from "@/db/schema"
import { AdditionalContext } from "@/lib/session-middleware"
import { Role } from "@/lib/types"
import { z } from "zod"
import { eq } from "drizzle-orm"




const app = new Hono<AdditionalContext>()
    .get("/", async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const majors = await db.select().from(major)
        return c.json({majors})
    })

    .get("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { id } = c.req.valid('param')
        const [majorSelected] = await db.select().from(major).where(eq(major.id, id))
        return c.json({ majorSelected })
    })
        

    .post("/", zValidator('json', insertMajorSchima.pick({ name: true })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { name } = c.req.valid('json')
        const [majorCreated] = await db.insert(major).values({ name }).returning()

        return c.json({ data: majorCreated })
    })

    .patch("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), zValidator('json', insertMajorSchima.pick({ name: true })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { id } = c.req.valid('param')
        const { name } = c.req.valid('json')
        const majorUpdated = await db
            .update(major)
            .set({ name })
            .where(eq(major.id, id))
            .returning()
            
        return c.json({ majorUpdated })
    })

    .delete("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { id } = c.req.valid('param')
        const majorDeleted = await db
            .delete(major)
            .where(eq(major.id, id))
            .returning()
        return c.json({ majorDeleted })
    })


export default app