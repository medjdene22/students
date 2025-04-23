import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/db"
import { insertMajorSchima, major } from "@/db/schema"
import { AdditionalContext } from "@/lib/session-middleware"
import { z } from "zod"
import { eq, inArray } from "drizzle-orm"
import { adminMiddleware } from "@/lib/admin-middleware"

const app = new Hono<AdditionalContext>()
    .use(adminMiddleware)
    .get("/", async (c) => {

        const majors = await db.select().from(major)
        return c.json({majors})
    })

    .get("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {

        const { id } = c.req.valid('param')
        const [majorSelected] = await db.select().from(major).where(eq(major.id, id))
        return c.json({ majorSelected })
    })
        

    .post("/", zValidator('json', insertMajorSchima.pick({ name: true })), async (c) => {

        const { name } = c.req.valid('json')
        const [majorCreated] = await db.insert(major).values({ name }).returning()

        return c.json({ data: majorCreated })
    })

    .patch("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), zValidator('json', insertMajorSchima.pick({ name: true })), async (c) => {

        const { id } = c.req.valid('param')
        const { name } = c.req.valid('json')
        const [majorUpdated] = await db
            .update(major)
            .set({ name })
            .where(eq(major.id, id))
            .returning()
            
        return c.json({ majorUpdated })
    })

    .delete("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {

        const { id } = c.req.valid('param')
        const [majorDeleted] = await db
            .delete(major)
            .where(eq(major.id, id))
            .returning()
        return c.json({ majorDeleted })
    })

    .post("/bulk", zValidator('json', z.object({ ids: z.array(z.number()) })), async (c) => {

        const { ids } = c.req.valid('json')
        const majorDeleted = await db
            .delete(major)
            .where(
                inArray(major.id, ids)
            )
            .returning()
        return c.json({ majorDeleted })
    })


export default app