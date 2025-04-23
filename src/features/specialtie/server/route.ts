import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/db"
import { insertSpecialtiesSchima, insertspecialtySubjectSchima, specialties as specialtie, specialtySubject, subject } from "@/db/schema"
import { AdditionalContext } from "@/lib/session-middleware"
import { z } from "zod"
import { eq, inArray } from "drizzle-orm"
import { adminMiddleware } from "@/lib/admin-middleware"


const app = new Hono<AdditionalContext>()
    .use(adminMiddleware)
    .get("/", async (c) => {

        const specialties = await db.select().from(specialtie)
        return c.json({specialties})
    })

    .get("/major/:majorId", zValidator('param', z.object({ majorId: z.coerce.number()  })), async (c) => {

        const { majorId } = c.req.valid('param')
        
        const specialties = await db
            .select({
                id: specialtie.id,
                name: specialtie.name,
                cycle: specialtie.cycle,
                majorId: specialtie.majorId,
            })
            .from(specialtie)
            .where(eq(specialtie.majorId, majorId))
        return c.json({specialties})
    })

    .get("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {

        const { id } = c.req.valid('param')
        const [specialtieSelected] = await db
            .select().from(specialtie)
            .where(eq(specialtie.id, id))
        return c.json({specialtieSelected})
    })

    .post("/", zValidator('json', insertSpecialtiesSchima.omit({ id: true })), async (c) => {

        const values = c.req.valid('json')
        const [specialtieCreated] = await db.insert(specialtie).values({ ...values }).returning()

        return c.json({ specialtieCreated })
    })

    .patch("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), zValidator('json', insertSpecialtiesSchima.omit({ id: true, majorId: true })), async (c) => {

        const { id } = c.req.valid('param')
        const values = c.req.valid('json')
        const [specialtieUpdated] = await db
            .update(specialtie)
            .set({ ...values })
            .where(eq(specialtie.id, id))
            .returning()
            
        return c.json({ specialtieUpdated })
    })

    .delete("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {

        const { id } = c.req.valid('param')
        const [specialtieDeleted] = await db
            .delete(specialtie)
            .where(eq(specialtie.id, id))
            .returning()
        return c.json({ specialtieDeleted })
    })

    .post("/bulk", zValidator('json', z.object({ ids: z.array(z.number()) })), async (c) => {

            const { ids } = c.req.valid('json')
            const specialtiesDeleted = await db
                .delete(specialtie)
                .where(
                    inArray(specialtie.id, ids)
                )
                .returning()
            return c.json({ specialtiesDeleted })
    })

    // // API endpoints for specialty subjects
    .get("/:id/subjects", zValidator('param', z.object({ id: z.coerce.number() })), async (c) => {
        const { id } = c.req.valid('param')
        
        const subjectSpecialties = await db.select({
            specialtySubjectId: specialtySubject.id,
            subjectId: subject.id,
            subjectName: subject.name,
            year: specialtySubject.year
        })
        .from(specialtySubject)
        .innerJoin(subject, eq(subject.id, specialtySubject.subjectId))
        .where(eq(specialtySubject.specialtyId, id))
        
        return c.json({ subjectSpecialties })
    })

    .post("/:id", zValidator('json', insertspecialtySubjectSchima), async (c) => {
        const { specialtyId, subjectId, year } = c.req.valid('json')
        
        const [specialtySubjectCreated] = await db.insert(specialtySubject)
            .values({ specialtyId, subjectId, year })
            .returning()
        
        return c.json({ specialtySubjectCreated })
    })

    .delete("/:id/subject", zValidator('param', z.object({ id: z.coerce.number() })), async (c) => {
        const { id } = c.req.valid('param')
        
        const [specialtySubjectDeleted] = await db.delete(specialtySubject)
            .where(eq(specialtySubject.id, id))
            .returning()
        
        return c.json({ specialtySubjectDeleted })
    })

    .post("/:id/delete-bulk", zValidator('json', z.object({ ids: z.array(z.number()) })), async (c) => {
        const { ids } = c.req.valid('json')
        
        const specialtySubjectsDeleted = await db.delete(specialtySubject)
            .where(inArray(specialtySubject.id, ids))
            .returning()
        
        return c.json({ specialtySubjectsDeleted })
    })


export default app