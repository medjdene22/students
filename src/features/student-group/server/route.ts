import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/db"
import { insertStudentGroupSchima, studentGroup } from "@/db/schema"
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
        const groups = await db.select().from(studentGroup)
        return c.json({groups})
    })

    .get("/:specialtyId", zValidator('param', z.object({ specialtyId: z.coerce.number()  })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { specialtyId } = c.req.valid('param')
        const groups = await db
            .select().from(studentGroup)
            .where(eq(studentGroup.specialtyId, specialtyId))
        return c.json({groups})
    })

    .post("/", zValidator('json', insertStudentGroupSchima.omit({ id: true })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const values = c.req.valid('json')
        const groupCreated = await db.insert(studentGroup).values({ ...values }).returning()

        return c.json({ groupCreated })
    })

    .patch("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), zValidator('json', insertStudentGroupSchima.omit({ id: true })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { id } = c.req.valid('param')
        const values = c.req.valid('json')
        const groupUpdated = await db
            .update(studentGroup)
            .set({ ...values })
            .where(eq(studentGroup.id, id))
            .returning()
            
        return c.json({ groupUpdated })
    })

    .delete("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        const user = c.get("user")
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const { id } = c.req.valid('param')
        const groupDeleted = await db
            .delete(studentGroup)
            .where(eq(studentGroup.id, id))
            .returning()
        return c.json({ groupDeleted })
    })


export default app