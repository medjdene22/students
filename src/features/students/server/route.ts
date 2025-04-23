import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { AdditionalContext } from "@/lib/session-middleware"
import { Role } from "@/lib/types"
import { studentGroup, studentInformation, user } from "@/db/schema"
import { db } from "@/db"
import { eq, inArray } from "drizzle-orm"
import { createStudentSchima, editStudentSchema } from "../schema"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { adminMiddleware } from "@/lib/admin-middleware"


const app = new Hono<AdditionalContext>()
    .use(adminMiddleware)
    .get("/", async (c) => {

        const studentsSelected = await db
        .select({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            groupName: studentGroup.name,
            groupId: studentInformation.groupId,
        }).from(studentInformation).innerJoin(user, eq(studentInformation.studentId, user.id)).innerJoin(studentGroup, eq(studentGroup.id, studentInformation.groupId))
        
        const students = studentsSelected.map(student => ({...student, username: student.username ?? 'no matricule'}))
        
        return c.json({students})
    })

    .get("/:id", zValidator('param', z.object({ id: z.string() })), async (c) => {

        const {id} = c.req.valid('param')
        const [studentSelected] = await db
        .select({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            groupName: studentGroup.name,
            groupId: studentInformation.groupId,
        }).from(studentInformation).innerJoin(user, eq(studentInformation.studentId, user.id)).innerJoin(studentGroup, eq(studentGroup.id, studentInformation.groupId))
        .where(eq(studentInformation.studentId, id))

        const student = {...studentSelected, username: studentSelected.username ?? 'no matricule'}

        return c.json({student})
    })

    .get("/group/:id", zValidator('param', z.object({ id: z.coerce.number()  })), async (c) => {

        const { id } = c.req.valid('param')
        const studentsSelected = await db
            .select({
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                groupName: studentGroup.name,
                groupId: studentInformation.groupId,
            }).from(studentInformation).innerJoin(user, eq(studentInformation.studentId, user.id)).innerJoin(studentGroup, eq(studentGroup.id, studentInformation.groupId))
            .where(eq(studentInformation.groupId, id))

        const students = studentsSelected.map(student => ({...student, username: student.username ?? 'no matricule'}))

        return c.json({students})
    })

    .post("/", zValidator('json', createStudentSchima), async (c) => {

        const values = c.req.valid('json')
        const userCreated = await auth.api.createUser({
            headers: c.req.raw.headers, 
            body: {
                email: values.email,
                password: values.password,
                name: values.name,
                role: Role.STUDENT,
                data: {
                    username: values.username,
                }
            }
        })
        
        const [studentInfo] = await db.insert(studentInformation).values({
            studentId: userCreated.user.id,
            groupId: values.groupId
            
        }).returning()
        
        
        return c.json({student: {
                ...userCreated.user,
                groupId: studentInfo.groupId
            }
        })
    })


    .patch("/:id", zValidator('param', z.object({ id: z.string() })), zValidator('json', editStudentSchema), async (c) => {


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
            await ctx.internalAdapter.updatePassword(updatedUser.id, hashedPassword)
            console.log("password updated")
        }
        
        // Update student information (group)
        const [studentInfo] = await db
            .update(studentInformation)
            .set({ 
                groupId: values.groupId
            })
            .where(eq(studentInformation.studentId, updatedUser.id))
            .returning()
        
        
        return c.json({ 
            studentUpdated: {
                groupId: studentInfo.groupId
            } 
        })
    })
    
    .delete("/:id", zValidator('param', z.object({ id: z.string() })), async (c) => {

        const { id } = c.req.valid('param')
        const [deletedStudentInfo] = await db.delete(studentInformation).where(eq(studentInformation.studentId, id)).returning()

        await auth.api.removeUser({
            headers: c.req.raw.headers,
            body: {
                userId: id
            }
        })
        return c.json({ studentDeleted: {
            groupId: deletedStudentInfo.groupId ?? null
        } })
    })

    .post("/bulk", zValidator('json', z.object({ ids: z.array(z.string()) })), async (c) => {

        const { ids } = c.req.valid('json')
        const deletedStudentsInfo = await db
            .delete(studentInformation)
            .where(
                inArray(studentInformation.studentId, ids)
            )
            .returning()

        await Promise.all(
            deletedStudentsInfo.map((deletedStudentInfo) => 
                auth.api.removeUser({
                headers: c.req.raw.headers,
                body: {
                    userId: deletedStudentInfo.studentId
                }
                })
            )
        );

        const groups = deletedStudentsInfo.map((deletedStudentInfo) => ({
            groupId: deletedStudentInfo.groupId
        }))

        return c.json({ groups })

    })


export default app