import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/db"
import { insertStudentGroupSchima, studentGroup,} from "@/db/schema"
import { AdditionalContext } from "@/lib/session-middleware"
// import { Role } from "@/lib/types"
import { z } from "zod"
import { eq, inArray } from "drizzle-orm"
import { adminMiddleware } from "@/lib/admin-middleware"




const app = new Hono<AdditionalContext>()
    .use(adminMiddleware)
    .get("/", async (c) => {
        
        const groups = await db.select().from(studentGroup)
        return c.json({groups})
    })

    .get("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        
        const { id } = c.req.valid('param')
        const [group] = await db
            .select().from(studentGroup)
            .where(eq(studentGroup.id, id))
        return c.json({group})
    })

    .get("/specialty/:specialtyId", zValidator('param', z.object({ specialtyId: z.coerce.number()  })), async (c) => {
        
        const { specialtyId } = c.req.valid('param')
        const groups = await db
            .select().from(studentGroup)
            .where(eq(studentGroup.specialtyId, specialtyId))
        return c.json({groups})
    })

    .post("/", zValidator('json', insertStudentGroupSchima.omit({ id: true })), async (c) => {
        
        const values = c.req.valid('json')
        const [groupCreated] = await db.insert(studentGroup).values({ ...values }).returning()

        return c.json({ groupCreated })
    })

    .patch("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), zValidator('json', insertStudentGroupSchima.omit({ id: true })), async (c) => {
        
        const { id } = c.req.valid('param')
        const values = c.req.valid('json')
        const [groupUpdated] = await db
            .update(studentGroup)
            .set({ ...values })
            .where(eq(studentGroup.id, id))
            .returning()
            
        return c.json({ groupUpdated })
    })

    .delete("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        
        const { id } = c.req.valid('param')
        const [groupDeleted] = await db
            .delete(studentGroup)
            .where(eq(studentGroup.id, id))
            .returning()
        return c.json({ groupDeleted })
    })

    .post("/bulk", zValidator('json', z.object({ ids: z.array(z.number()) })), async (c) => {
                
                const { ids } = c.req.valid('json')
                const groupsDeleted = await db
                    .delete(studentGroup)
                    .where(
                        inArray(studentGroup.id, ids)
                    )
                    .returning()
                return c.json({ groupsDeleted })
    })


export default app