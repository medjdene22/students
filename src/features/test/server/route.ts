import { db } from "@/db";
import {  teacherAssignment, user, assessmentTest, assessmentTestSchima, studentInformation, studentSubjectEvent, assessmentTestEvent, assessmentTestEventSchima } from "@/db/schema";
import { AdditionalContext } from "@/lib/session-middleware";
import { teacherMiddleware } from "@/lib/teacher-middleware";
import { Events } from "@/lib/types";
import { zValidator } from "@hono/zod-validator";
import { sql, eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono<AdditionalContext>()
    .use(teacherMiddleware)
    .get("/:teacherAssignmentId", zValidator('param', z.object({ teacherAssignmentId: z.coerce.number() })), async (c) => {
        const teacher = c.get("teacher");
        const { teacherAssignmentId } = c.req.valid('param')
        // Verify teacher has access to this assignment
        const [assignment] = await db
        .select()
        .from(teacherAssignment)
        .where(
            and(
                eq(teacherAssignment.teacherId, teacher.id),
                eq(teacherAssignment.id, teacherAssignmentId),
            ),
        );
        if (!assignment) return c.json({ error: "Unauthorized" }, 401);

        const tests = await db
            .select({
                id: assessmentTest.id,
                name: assessmentTest.name,
                testDate: assessmentTest.testDate,
                replacementDate: assessmentTest.replacementDate,

            })
            .from(assessmentTest)
            .where(
                    eq(assessmentTest.assessmentId, assignment.id)
            )

        return c.json({ tests, assignment })
    })

    .get("/:teacherAssignmentId/:testId", 
        zValidator('param', z.object({ 
            teacherAssignmentId: z.coerce.number(),
            testId: z.coerce.number()
        })), async (c) => {
            const teacher = c.get("teacher");
            const { teacherAssignmentId, testId } = c.req.valid('param');

            const [assignment] = await db
                .select()
                .from(teacherAssignment)
                .where(
                    and(
                        eq(teacherAssignment.teacherId, teacher.id),
                        eq(teacherAssignment.id, teacherAssignmentId),
                    ),
                );
            
            if (!assignment) return c.json({ error: "Unauthorized" }, 401);

            const [test] = await db
            .select({
                id: assessmentTest.id,
                name: assessmentTest.name,
                testDate: assessmentTest.testDate,
                replacementDate: assessmentTest.replacementDate,

            })
            .from(assessmentTest)
            .where(
                and(
                    eq(assessmentTest.id, testId),
                    eq(assessmentTest.assessmentId, teacherAssignmentId)
                )
            )

            const studentToTest = await db
            .select({
                studentId: studentInformation.studentId,
                name: user.name,
                subjectStatus: sql<'excluded' | 'enrolled'>`
                                            CASE
                                                WHEN COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END) >= 3 THEN 'excluded'
                                                ELSE 'enrolled'
                                            END
                                            `,
                eventId: assessmentTestEvent.id,
                testStatus: sql<Events | 'ds'>`COALESCE(${assessmentTestEvent.event}::text, 'taken')`
            })
            .from(teacherAssignment).where(and(eq(teacherAssignment.groupId, assignment.groupId),eq(teacherAssignment.specialtySubjectId, assignment.specialtySubjectId) ))
            .innerJoin(studentInformation, eq(studentInformation.groupId, assignment.groupId))
            .innerJoin(user, eq(user.id, studentInformation.studentId))
            .leftJoin(studentSubjectEvent, and(eq(studentSubjectEvent.studentId, user.id), eq(studentSubjectEvent.teacherAssignmentId, teacherAssignment.id)))     
            .leftJoin(assessmentTestEvent, and(eq(assessmentTestEvent.studentId, user.id), eq(assessmentTestEvent.assessmentTestId, test.id)))
            .groupBy(studentInformation.studentId, user.name,assessmentTestEvent.id, assessmentTestEvent.event);

            const studentToRemplacement = studentToTest.filter((student)=>{
                return student.testStatus===Events.ABSENCE_JUSTIFIED
            })

            return c.json({ test, assignment, studentToTest, studentToRemplacement })
        })

    .post("/:teacherAssignmentId", 
        zValidator('param', z.object({ teacherAssignmentId: z.coerce.number() })),
        zValidator('json', assessmentTestSchima.omit({ id: true, assessmentId: true })),
        async (c) => {
            const teacher = c.get("teacher");
            const testData = c.req.valid('json');
            const { teacherAssignmentId } = c.req.valid('param');
            
            // Verify teacher has access to this assignment
            const [assignment] = await db
                .select()
                .from(teacherAssignment)
                .where(
                    and(
                        eq(teacherAssignment.teacherId, teacher.id),
                        eq(teacherAssignment.id, teacherAssignmentId),
                    ),
                );
            
            if (!assignment) return c.json({ error: "Unauthorized" }, 401);
            
            // Create new test
            const [newTest] = await db
                .insert(assessmentTest)
                .values({
                    ...testData,
                    assessmentId: teacherAssignmentId,
                })
                .returning();
                
            return c.json({ test: newTest });
        }
    )

    .post("/:teacherAssignmentId/:testId",
        zValidator('param', z.object({ teacherAssignmentId: z.coerce.number(), testId: z.coerce.number() })),
        zValidator('json', assessmentTestEventSchima.omit({ id: true, assessmentTestId: true })),
        async (c) => {
            const teacher = c.get("teacher");
            const testEventData = c.req.valid('json');
            const { teacherAssignmentId, testId } = c.req.valid('param');

            const [test] = await db
                .select({
                    testId: assessmentTest.id,
                    name: assessmentTest.name,
                    testDate: assessmentTest.testDate,
                    replacementDate: assessmentTest.replacementDate,
                })
                .from(assessmentTest).innerJoin(teacherAssignment, eq(teacherAssignment.id, teacherAssignmentId))
                .where(
                    and(
                        eq(assessmentTest.id, testId),
                        eq(teacherAssignment.teacherId, teacher.id)
                    ),
                );
            if (!test) return c.json({ error: "Unauthorized" }, 401);
                
            // check if test is taken
            const [takenTest] = await db
                .select()
                .from(assessmentTestEvent)
                .where(
                    and(
                        eq(assessmentTestEvent.studentId, testEventData.studentId),
                        eq(assessmentTestEvent.assessmentTestId, testId),
                    ),
                );
            if (takenTest) {
                const [resultEvent] = await db
                .update(assessmentTestEvent)
                .set({
                    ...testEventData,
                })
                .where(
                    and(
                        eq(assessmentTestEvent.id, takenTest.id),
                    ),
                ).returning();
                
                return c.json({ event: resultEvent});
            }else{
                const [resultEvent] = await db
                .insert(assessmentTestEvent)
                .values({
                    ...testEventData,
                    assessmentTestId: testId,
                })
                .returning();
                
                return c.json({ event: resultEvent});
            }
        }
    )      

    .patch("/:teacherAssignmentId/:testId", 
        zValidator('param', z.object({ 
            teacherAssignmentId: z.coerce.number(),
            testId: z.coerce.number()
        })),
        zValidator('json', assessmentTestSchima.partial()), 
        async (c) => {
            const teacher = c.get("teacher");
            const { teacherAssignmentId, testId } = c.req.valid('param');
            const testData = c.req.valid('json');
            
            // Verify teacher has access to this assignment
            const [assignment] = await db
                .select()
                .from(teacherAssignment)
                .where(
                    and(
                        eq(teacherAssignment.teacherId, teacher.id),
                        eq(teacherAssignment.id, teacherAssignmentId),
                    ),
                );
            
            if (!assignment) return c.json({ error: "Unauthorized" }, 401);
            
            // Update test data
            const [updatedTest] = await db
                .update(assessmentTest)
                .set(testData)
                .where(
                    and(
                        eq(assessmentTest.id, testId),
                        eq(assessmentTest.assessmentId, teacherAssignmentId)
                    )
                )
                .returning();
                
            if (!updatedTest) return c.json({ error: "Test not found" }, 404);
            
            return c.json({ test: updatedTest });
        }
    )
    .delete("/:teacherAssignmentId/:testId", 
        zValidator('param', z.object({ 
            teacherAssignmentId: z.coerce.number(),
            testId: z.coerce.number()
        })), 
        async (c) => {
            const teacher = c.get("teacher");
            const { teacherAssignmentId, testId } = c.req.valid('param');
            
            // Verify teacher has access to this assignment
            const [assignment] = await db
                .select()
                .from(teacherAssignment)
                .where(
                    and(
                        eq(teacherAssignment.teacherId, teacher.id),
                        eq(teacherAssignment.id, teacherAssignmentId),
                    ),
                );
            
            if (!assignment) return c.json({ error: "Unauthorized" }, 401);
            
            // Delete test
            const [deletedTest] = await db
                .delete(assessmentTest)
                .where(
                    and(
                        eq(assessmentTest.id, testId),
                        eq(assessmentTest.assessmentId, teacherAssignmentId)
                    )
                )
                .returning();
                
            if (!deletedTest) return c.json({ error: "Test not found" }, 404);
            
            return c.json({ test: deletedTest });
        }
    )
    .delete("/:teacherAssignmentId/:testId/:eventId", 
        zValidator('param', z.object({ 
            teacherAssignmentId: z.coerce.number(),
            testId: z.coerce.number(),
            eventId: z.coerce.number()
        })), 
        async (c) => {
            const teacher = c.get("teacher");
            const { teacherAssignmentId, testId, eventId } = c.req.valid('param');

            const [test] = await db
            .select({
                testId: assessmentTest.id,
                name: assessmentTest.name,
                testDate: assessmentTest.testDate,
                replacementDate: assessmentTest.replacementDate,

            })
            .from(assessmentTest).innerJoin(teacherAssignment, eq(teacherAssignment.id, teacherAssignmentId))
            .where(
                and(
                    eq(assessmentTest.id, testId),
                    eq(teacherAssignment.teacherId, teacher.id)
                ),
            );
            if (!test) return c.json({ error: "Unauthorized" }, 401);

            const [event] = await db
                .delete(assessmentTestEvent)
                .where(
                    and(
                        eq(assessmentTestEvent.id, eventId),
                        eq(assessmentTestEvent.assessmentTestId, testId),
                    ),
                ).returning();
            return c.json({ event });   
            }
    )

export default app