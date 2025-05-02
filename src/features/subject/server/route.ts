import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/db"
import { insertspecialtySubjectSchima, insertSubjectSchima, specialties, subject, specialtySubject } from "@/db/schema"
import { AdditionalContext } from "@/lib/session-middleware"
import { z } from "zod"
import { eq, inArray } from "drizzle-orm"
import { adminMiddleware } from "@/lib/admin-middleware"


const app = new Hono<AdditionalContext>()
    .use(adminMiddleware)
    .post("/", zValidator('json', insertSubjectSchima ), async (c) => {
        
        const {name} = c.req.valid('json')

        const [subjectCreated] = await db.insert(subject).values({ name }).returning()

        return c.json({ data: subjectCreated })
    })

    .get("/", async (c) => {
        
        const subjects = await db.select().from(subject)
        
        return c.json({"subjects": subjects})
    })

    .get("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        
        const { id } = c.req.valid('param')
        const [subjectSelected] = await db.select().from(subject).where(eq(subject.id, id))
        return c.json({ subjectSelected })
    })
        

    .patch("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), zValidator('json', insertSubjectSchima.pick({ name: true })), async (c) => {
        
        const { id } = c.req.valid('param')
        const { name } = c.req.valid('json')
        const [subjectUpdated] = await db
            .update(subject)
            .set({ name })
            .where(eq(subject.id, id))
            .returning()
            
        return c.json({ subjectUpdated })
    })

    .delete("/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        
        const { id } = c.req.valid('param')
        const [subjectDeleted] = await db
            .delete(subject)
            .where(eq(subject.id, id))
            .returning()
        return c.json({ subjectDeleted })
    })

    .post("/bulk", zValidator('json', z.object({ ids: z.array(z.number()) })), async (c) => {
        
        const { ids } = c.req.valid('json')
        const subjectDeleted = await db
            .delete(subject)
            .where(
                inArray(subject.id, ids)
            )
            .returning()
        return c.json({ subjectDeleted })
    })

    .get("/seed/pleas", async (c) => {
        
        const subjectsinserted = await db.insert(subject).values(
            [
                {
                  "id": 1,
                  "name": "Analysis 1"
                },
                {
                  "id": 2,
                  "name": "Algebra 1"
                },
                {
                  "id": 3,
                  "name": "Algorithms and Data Structures 1"
                },
                {
                  "id": 4,
                  "name": "Machine Structure 1"
                },
                {
                  "id": 5,
                  "name": "Scientific Terminology and Written Expression"
                },
                {
                  "id": 6,
                  "name": "Foreign Language 1"
                },
                {
                  "id": 7,
                  "name": "Physics 1 (Point Mechanics)"
                },
                {
                  "id": 8,
                  "name": "Electronics and System Components"
                },
                {
                  "id": 9,
                  "name": "Analysis 2"
                },
                {
                  "id": 10,
                  "name": "Algebra 2"
                },
                {
                  "id": 11,
                  "name": "Algorithms and Data Structures 2"
                },
                {
                  "id": 12,
                  "name": "Machine Structure 2"
                },
                {
                  "id": 13,
                  "name": "Introduction to Probability and Descriptive Statistics"
                },
                {
                  "id": 14,
                  "name": "Information and Communication Technology"
                },
                {
                  "id": 15,
                  "name": "Programming Tools for Mathematics"
                },
                {
                  "id": 16,
                  "name": "Physics 2 (General Electricity)"
                },
                {
                  "id": 17,
                  "name": "Computer Architecture"
                },
                {
                  "id": 18,
                  "name": "Algorithms and Data Structures 3"
                },
                {
                  "id": 19,
                  "name": "Information Systems"
                },
                {
                  "id": 20,
                  "name": "Graph Theory"
                },
                {
                  "id": 21,
                  "name": "Numerical Methods"
                },
                {
                  "id": 22,
                  "name": "Mathematical Logic"
                },
                {
                  "id": 23,
                  "name": "Foreign Language 2"
                },
                {
                  "id": 24,
                  "name": "Language Theory"
                },
                {
                  "id": 25,
                  "name": "Operating Systems 1"
                },
                {
                  "id": 26,
                  "name": "Databases"
                },
                {
                  "id": 27,
                  "name": "Networks"
                },
                {
                  "id": 28,
                  "name": "Object-Oriented Programming"
                },
                {
                  "id": 29,
                  "name": "Web Application Development"
                },
                {
                  "id": 30,
                  "name": "Foreign Language 3"
                },
                {
                  "id": 31,
                  "name": "Distributed Information Systems"
                },
                {
                  "id": 32,
                  "name": "Decision Support Systems"
                },
                {
                  "id": 33,
                  "name": "Software Engineering"
                },
                {
                  "id": 34,
                  "name": "Human-Computer Interface"
                },
                {
                  "id": 35,
                  "name": "Information Systems Administration"
                },
                {
                  "id": 36,
                  "name": "Advanced Web Programming"
                },
                {
                  "id": 37,
                  "name": "Digital Economy and Strategic Watch"
                },
                {
                  "id": 38,
                  "name": "Information Retrieval"
                },
                {
                  "id": 39,
                  "name": "Computer Security"
                },
                {
                  "id": 40,
                  "name": "Semi-structured Data"
                },
                {
                  "id": 41,
                  "name": "Operating Systems 2"
                },
                {
                  "id": 42,
                  "name": "Project"
                },
                {
                  "id": 43,
                  "name": "Business Intelligence"
                },
                {
                  "id": 44,
                  "name": "Scientific Writing"
                }
              ]
        ).returning()

        return c.json({subjectsinserted})
    })

    // .get("/groupId/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
        
    //     const { id } = c.req.valid('param')
    //     const subjectGroupSelected = await db.select({
    //         subjectGroupId: subjectGroup.id,
    //         subjectId: subject.id,
    //         subjectName: subject.name,

    //     }).from(subjectGroup).innerJoin(studentGroup, eq(studentGroup.id, subjectGroup.groupId)).innerJoin(subject, eq(subject.id, subjectGroup.subjectId)).innerJoin(specialties, eq(specialties.id, studentGroup.specialtyId))
    //     .where(eq(subjectGroup.groupId, id))
    //     return c.json({ subjectGroupSelected })
    // })






    
    .get("/:id/specialties", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {
      
      const { id } = c.req.valid('param')
      const specialtySubjects = await db.select({
          specialtySubjectId: specialtySubject.id,
          specialtyId: specialties.id,
          specialtyName: specialties.name,
          specialtyYear: specialtySubject.year
      }).from(specialtySubject).innerJoin(specialties, eq(specialties.id, specialtySubject.specialtyId))
      .where(eq(specialtySubject.subjectId, id))
      return c.json({ specialtySubjects })
    })

    .post("/:id", zValidator('json', insertspecialtySubjectSchima), async (c) => {
      try {
        const {subjectId, specialtyId, year} = c.req.valid('json')  

        const [subjectSpecialtyCreated] = await db.insert(specialtySubject).values({ subjectId, specialtyId, year }).returning()

        return c.json({ subjectSpecialtyCreated })
       
      } catch (error) {
        return c.json({ error }, 409)
      }
    })

    .post("/:id/delete-bulk", zValidator('json', z.object({ ids: z.array(z.number()) })), async (c) => {
        
        const { ids } = c.req.valid('json')
        const subjectSpecialtiesDeleted = await db
            .delete(specialtySubject)   
            .where(
                inArray(specialtySubject.id, ids)
            )
            .returning()
        
        return c.json({ subjectSpecialtiesDeleted })
    })
    .delete("/:id/specialty", zValidator('param', z.object({ id: z.coerce.number()})), async (c) => {
        
      const { id } = c.req.valid('param')
      const [subjectSpecialtyDeleted] = await db
          .delete(specialtySubject)
          .where(
              eq(specialtySubject.id, id)
          )
          .returning()
      
      return c.json({ subjectSpecialtyDeleted })
    })


export default app