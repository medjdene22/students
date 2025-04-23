import { db } from "@/db";
import { specialtySubject, studentGroup, subject, teacherAssignment, teacherAssignmentSchima, user } from "@/db/schema";
import { adminMiddleware } from "@/lib/admin-middleware";
import { AdditionalContext } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { sql, eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";



const app = new Hono<AdditionalContext>()
    .use(adminMiddleware)
.get("/:id", zValidator('param', z.object({ id: z.coerce.number() })), async (c) => {
        
    const { id } = c.req.valid('param')
    const assignments = await db
        .select({
            specialtySubjectId: specialtySubject.id,
            subjectId: subject.id,
            subjectName: subject.name,
            assignTeachers: sql<
                Array<{
                    assignmentId: number ; // depends on your ID type
                    teacherId: string;
                    teacherName: string;
                    assessment: "exam" | "td" | "tp";
                }> | []
              >
              `COALESCE(
                JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                    'assignmentId', ${teacherAssignment.id},
                    'teacherId', ${teacherAssignment.teacherId},
                    'teacherName', ${user.name},
                    'assessment', ${teacherAssignment.assessment_type}
                  )
                ) FILTER (WHERE ${teacherAssignment.teacherId} IS NOT NULL),
                '[]'::JSONB
              )`
        })
        .from(studentGroup).where(eq(studentGroup.id, id))
        .innerJoin(specialtySubject, and(eq(specialtySubject.specialtyId, studentGroup.specialtyId) , eq(specialtySubject.year, studentGroup.year)))
        .innerJoin(subject, eq(subject.id, specialtySubject.subjectId))
        
        .leftJoin(teacherAssignment, 
            and(
                eq(teacherAssignment.groupId, studentGroup.id),
                eq(teacherAssignment.specialtySubjectId, specialtySubject.id)
            )
        )
        .leftJoin(user, eq(user.id, teacherAssignment.teacherId))
        .groupBy(specialtySubject.id, subject.id, subject.name)

        //"exam" | "td" | "tp"
    const teacherAssignments = assignments.map(assignment => ({
        ...assignment,
        assignTeachers: {
            exam: assignment.assignTeachers.find(teacher => teacher.assessment === "exam"),
            td: assignment.assignTeachers.find(teacher => teacher.assessment === "td"),
            tp: assignment.assignTeachers.find(teacher => teacher.assessment === "tp")
        }
    }))

    return c.json({ teacherAssignments })
})


.post("/:groupId", 
    zValidator('param', z.object({ groupId: z.coerce.number() })),
    zValidator('json', teacherAssignmentSchima.omit({ id: true, groupId: true })),
    async (c) => {
        
        const { groupId } = c.req.valid('param')
        const values = c.req.valid('json')
        
        const [assignmentCreated] = await db
            .insert(teacherAssignment)
            .values({ ...values, groupId: groupId })
            .returning()
            
        return c.json({ assignmentCreated })
})

.patch("/:assignmentId", 
    zValidator('param', z.object({ 
        assignmentId: z.coerce.number() 
    })), 
    zValidator('json', teacherAssignmentSchima.pick({ teacherId: true})),
    async (c) => {
        
        const { assignmentId } = c.req.valid('param')
        const values = c.req.valid('json')
        
        const [assignmentUpdated] = await db
            .update(teacherAssignment)
            .set({ ...values })
            .where(eq(teacherAssignment.id, assignmentId))
            .returning()
            
        return c.json({ assignmentUpdated })
})

.delete("/:assignmentId", 
    zValidator('param', z.object({ 
        assignmentId: z.coerce.number() 
    })), 
    async (c) => {
        
        const { assignmentId } = c.req.valid('param')
        
        const [deletedAssignment] = await db
            .update(teacherAssignment)
            .set({ teacherId: null })
            .where(eq(teacherAssignment.id, assignmentId))
            .returning()
            
        return c.json({ deletedAssignment })
})


export default app