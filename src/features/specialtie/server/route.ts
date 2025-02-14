import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/db"
import { insertSpecialtiesSchima, specialties as specialtie } from "@/db/schema"
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
        const specialties = await db.select().from(specialtie)
        return c.json({specialties})
    })

    .get("/:majorId", zValidator('param', z.object({ majorId: z.coerce.number()  })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { majorId } = c.req.valid('param')
        const specialties = await db
            .select().from(specialtie)
            .where(eq(specialtie.majorId, majorId))
        return c.json({specialties})
    })

    .post("/", zValidator('json', insertSpecialtiesSchima.omit({ id: true })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const values = c.req.valid('json')
        const specialtieCreated = await db.insert(specialtie).values({ ...values }).returning()

        return c.json({ specialtieCreated })
    })

    .patch("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), zValidator('json', insertSpecialtiesSchima.omit({ id: true })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { id } = c.req.valid('param')
        const values = c.req.valid('json')
        const specialtieUpdated = await db
            .update(specialtie)
            .set({ ...values })
            .where(eq(specialtie.id, id))
            .returning()
            
        return c.json({ specialtieUpdated })
    })

    .delete("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { id } = c.req.valid('param')
        const specialtieDeleted = await db
            .delete(specialtie)
            .where(eq(specialtie.id, id))
            .returning()
        return c.json({ specialtieDeleted })
    })


export default app