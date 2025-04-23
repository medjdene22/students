import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { AdditionalContext } from "@/lib/session-middleware"
import { Role } from "@/lib/types"
import { teacherInformation, user } from "@/db/schema"
import { db } from "@/db"
import { count, eq, inArray } from "drizzle-orm"
import { createTeacherSchema, editTeacherSchema } from "../schema"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { adminMiddleware } from "@/lib/admin-middleware"

const app = new Hono<AdditionalContext>()
    .use(adminMiddleware)
    .get("/", async (c) => {
        
        const teachersSelected = await db
        .select({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            grade: teacherInformation.grade,
        }).from(teacherInformation)
        .innerJoin(user, eq(teacherInformation.teacherId, user.id))
        
        const teachers = teachersSelected.map(teacher => ({
            ...teacher, 
            username: teacher.username ?? 'no username'
        }))
        
        return c.json({teachers})
    })

    .get("/:id", zValidator('param', z.object({ id: z.string() })), async (c) => {
        
        const {id} = c.req.valid('param')
        const [teacherSelected] = await db
        .select({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            grade: teacherInformation.grade,
        }).from(teacherInformation)
        .innerJoin(user, eq(teacherInformation.teacherId, user.id))
        .where(eq(teacherInformation.teacherId, id))

        const teacher = {
            ...teacherSelected,
            username: teacherSelected.username ?? 'no username'
        }

        return c.json({teacher})
    })

    .post("/", zValidator('json', createTeacherSchema), async (c) => {

        const values = c.req.valid('json')
        const userCreated = await auth.api.createUser({
            headers: c.req.raw.headers, 
            body: {
                email: values.email,
                password: values.password,
                name: values.name,
                role: Role.TEACHER,
                data: {
                    username: values.username,
                }
            }
        })
        
        const [teacherInfo] = await db.insert(teacherInformation).values({
            teacherId: userCreated.user.id,
            grade: values.grade
            
        }).returning()
        
        return c.json({teacher: {
                ...userCreated.user,
                grade: teacherInfo.grade
            }
        })
    })

    .patch("/:id", zValidator('param', z.object({ id: z.string() })), zValidator('json', editTeacherSchema), async (c) => {
        
        const { id } = c.req.valid('param')
        const values = c.req.valid('json')
        
        // Update user information
        const [updatedUser] = await db.update(user).set({
            name: values.name,
            email: values.email,
            username: values.username,
            
        }).where(eq(user.id, id)).returning()

        if (values.changePassword && values.password) {
            const ctx = await auth.$context
            const hashedPassword = await ctx.password.hash(values.password)
            await ctx.internalAdapter.updatePassword(id, hashedPassword)
        }
        
        // Update teacher information (grade)
        const [teacherInfo] = await db
            .update(teacherInformation)
            .set({ 
                grade: values.grade
            })
            .where(eq(teacherInformation.teacherId, updatedUser.id))
            .returning()
        
        return c.json({ 
            teacherUpdated: {
                id,
                grade: teacherInfo.grade
            } 
        })
    })
    
    .delete("/:id", zValidator('param', z.object({ id: z.string() })), async (c) => {

        const { id } = c.req.valid('param')
        await db.delete(teacherInformation).where(eq(teacherInformation.teacherId, id))

        await auth.api.removeUser({
            headers: c.req.raw.headers,
            body: {
                userId: id
            }
        })
        
        return c.json({ teacherDeleted: { id } })
    })

    .post("/bulk", zValidator('json', z.object({ ids: z.array(z.string()) })), async (c) => {

        const { ids } = c.req.valid('json')
        await db
            .delete(teacherInformation)
            .where(
                inArray(teacherInformation.teacherId, ids)
            )

        await Promise.all(
            ids.map((id) => 
                auth.api.removeUser({
                    headers: c.req.raw.headers,
                    body: {
                        userId: id
                    }
                })
            )
        );

        return c.json({ success: true })
    })
    
    .get("/count", async (c) => {

        const [result] = await db
            .select({
                count: count(teacherInformation.id)
            })
            .from(teacherInformation)
        
        return c.json({count: Number(result.count)})
    })

export default app