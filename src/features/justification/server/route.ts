

import { db } from "@/db";
import { specialtySubject, subject, teacherAssignment, assessmentTest, studentSubjectEvent, assessmentTestEvent, absenceJustification } from "@/db/schema";
import { AdditionalContext } from "@/lib/session-middleware";
import { studentMiddleware } from "@/lib/student-middleware";
// import { teacherMiddleware } from "@/lib/teacher-middleware";
// import { Events } from "@/lib/types";
import { zValidator } from "@hono/zod-validator";
import {  eq, and, or } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { createJustificationSchima } from "../schema";
import { JustificationType, JustificationStatus, JustificationEvent, Justification } from "@/lib/types";




const app = new Hono<AdditionalContext>()
    .get("/", studentMiddleware,
        async (c) => {
        const student = c.get("student");
        const subjectJustifications = await db
            .select({
                eventId: studentSubjectEvent.id,
                subjectName: subject.name,
                event: studentSubjectEvent.event,
                eventDate: studentSubjectEvent.eventDate,
                assessmentType: teacherAssignment.assessment_type,

                justificationId: absenceJustification.id,
                status: absenceJustification.status,
                submitDate: absenceJustification.submitDate,
                verificationDate: absenceJustification.verificationDate,

            })
            .from(absenceJustification).innerJoin( studentSubjectEvent, eq(studentSubjectEvent.id, absenceJustification.subjectEventId),
            ).innerJoin( teacherAssignment, eq(teacherAssignment.id, studentSubjectEvent.teacherAssignmentId),
            ).innerJoin( specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId),
            ).innerJoin( subject, eq(subject.id, specialtySubject.subjectId))
            .where(
                and(
                    eq(studentSubjectEvent.studentId, student.id),
                    eq(absenceJustification.justificationType, 'session')
                )
            )

        const testJustifications = await db
            .select({
                eventId: assessmentTestEvent.id,
                subjectName: subject.name,
                event: assessmentTestEvent.event,
                eventDate: assessmentTest.testDate,
                testName: assessmentTest.name,
                assessmentType: teacherAssignment.assessment_type,

                justificationId: absenceJustification.id,
                status: absenceJustification.status,
                submitDate: absenceJustification.submitDate,
                verificationDate: absenceJustification.verificationDate,
            })
            .from(absenceJustification).innerJoin( assessmentTestEvent, eq(assessmentTestEvent.id, absenceJustification.testEventId),
            ).innerJoin( assessmentTest, eq(assessmentTest.id, assessmentTestEvent.assessmentTestId),
            ).innerJoin( teacherAssignment, eq(teacherAssignment.id, assessmentTest.assessmentId),
            ).innerJoin( specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId),
            ).innerJoin( subject, eq(subject.id, specialtySubject.subjectId))
            .where(
                and(
                    eq(assessmentTestEvent.studentId, student.id),
                    eq(absenceJustification.justificationType, 'test'),
                )
            )    


            const transformedSessionJustification = subjectJustifications.map(item => {
                return {
                    type: JustificationType.SESSION,
                    eventId: item.eventId,
                    event: item.event as JustificationEvent,
                    eventDate: item.eventDate,
                    justificationId: item.justificationId,
                    assessment: item.subjectName+" - "+item.assessmentType,
                    status: item.status as JustificationStatus,
                    submitDate: item.submitDate,
                    verificationDate: item.verificationDate,
                };
            });
            const transformedTestJustification = testJustifications.map(item => {
                return {
                    type: JustificationType.TEST,
                    eventId: item.eventId,
                    eventDate: item.eventDate,
                    event: item.event as JustificationEvent,
                    assessment: item.subjectName+ " - " + item.testName,
                    

                    justificationId: item.justificationId,
                    status: item.status as JustificationStatus,
                    submitDate: item.submitDate,
                    verificationDate: item.verificationDate,
                };
            });
            const justifications : Justification[] = [...transformedSessionJustification, ...transformedTestJustification];

            return c.json({ justifications });


    })

    .get("/:justificationId", zValidator('param', z.object({ justificationId: z.coerce.number() })), studentMiddleware,
        async (c) => {
        const student = c.get("student");
        const { justificationId } = c.req.valid('param');

        //check if absence exists and owner is student
        const [justification] = await db
            .select()
            .from(absenceJustification)
            .where(
                    eq(absenceJustification.id, justificationId)
            );

        if (!justification || !justification.testEventId && !justification.subjectEventId) return c.json({ error: "Justification not found" }, 404);

        const base64File = justification?.fileData.toString('base64');

        if (justification.justificationType === 'session') {
            const [subjectEvent] = await db.select({
                subjectName: subject.name,
                assessmentType: teacherAssignment.assessment_type,
                eventDate: studentSubjectEvent.eventDate,
            })
            .from(studentSubjectEvent).where(
                and(
                    eq(studentSubjectEvent.studentId, student.id),
                    eq(studentSubjectEvent.id, justification.subjectEventId!)
                )
            )
            .innerJoin( teacherAssignment, eq(teacherAssignment.id, studentSubjectEvent.teacherAssignmentId))
            .innerJoin( specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId))
            .innerJoin( subject, eq(subject.id, specialtySubject.subjectId))

            if (!subjectEvent) return c.json({ error: "Subject event not found" }, 404);

            return c.json({ subjectEvent, justification: { ...justification, fileData: base64File } });

        } else{

            const [subjectEvents] = await db.select({
                subjectName: subject.name,
                assessmentType: teacherAssignment.assessment_type,
                eventDate: assessmentTest.testDate,
                testName: assessmentTest.name,
            })
            .from(assessmentTestEvent)
            .where(
                and(
                    eq(assessmentTestEvent.studentId, student.id),
                    eq(assessmentTestEvent.id, justification.testEventId!)
                )
            )
            .innerJoin( assessmentTest,  eq(assessmentTest.id, assessmentTestEvent.assessmentTestId))
            .innerJoin( teacherAssignment, eq(teacherAssignment.id, assessmentTest.assessmentId))
            .innerJoin( specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId))
            .innerJoin( subject, eq(subject.id, specialtySubject.subjectId))

            const subjectEvent = {
                subjectName: subjectEvents.subjectName,
                assessmentType: subjectEvents.assessmentType,
                eventDate: subjectEvents.testName + ' - ' + subjectEvents.eventDate
            }

            if (!subjectEvent) return c.json({ error: "Subject event not found" }, 404);
            return c.json({ subjectEvent, justification: { ...justification, fileData: base64File } });

        }

    })
            
            
    .get("/event/:type/:eventId", zValidator('param', z.object({ eventId: z.coerce.number(),type: z.nativeEnum(JustificationType) })), studentMiddleware,
        async (c) => {
        const student = c.get("student");
        const { eventId, type } = c.req.valid('param');


        if (type === JustificationType.SESSION) {
            const [subjectEvent] = await db
            .select({
                subjectName: subject.name,
                assessmentType: teacherAssignment.assessment_type,
                eventDate: studentSubjectEvent.eventDate,

            })
            .from(studentSubjectEvent)
            .where(
                and(
                    eq(studentSubjectEvent.studentId, student.id),
                    eq(studentSubjectEvent.id, eventId),
                    // eq(studentSubjectEvent.event, Events.ABSENCE),
                ),
            )
            .innerJoin( teacherAssignment, eq(teacherAssignment.id, studentSubjectEvent.teacherAssignmentId),
            ).innerJoin( specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId),
            ).innerJoin( subject, eq(subject.id, specialtySubject.subjectId))

            if (!subjectEvent) return c.json({ error: "Subject event not found" }, 404);

            const [justification] = await db
            .select()
            .from(absenceJustification)
            .where(
                and(
                    eq(absenceJustification.subjectEventId, eventId),
                    eq(absenceJustification.justificationType, 'session'),
                    eq(absenceJustification.status, 'pending')
                ),
            );

            const base64File = justification?.fileData.toString('base64');

            return c.json({ subjectEvent, justification: { ...justification, fileData: base64File } });
        } else {
            const [subjectEvents] = await db
            .select({
                subjectName: subject.name,
                assessmentType: teacherAssignment.assessment_type,
                eventDate: assessmentTest.testDate,
                testName: assessmentTest.name,
            })
            .from(assessmentTestEvent)
            .where(
                and(
                    eq(assessmentTestEvent.studentId, student.id),
                    eq(assessmentTestEvent.id, eventId),
                    eq(assessmentTestEvent.assessmentTestId, assessmentTest.id),
                ),
            )
            .innerJoin( assessmentTest,  eq(assessmentTest.id, assessmentTestEvent.assessmentTestId))
            .innerJoin( teacherAssignment, eq(teacherAssignment.id, assessmentTest.assessmentId))
            .innerJoin( specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId),
            ).innerJoin( subject, eq(subject.id, specialtySubject.subjectId))

            if (!subjectEvents) return c.json({ error: "Subject event not found" }, 404);

            const subjectEvent = {
                subjectName: subjectEvents.subjectName,
                assessmentType: subjectEvents.assessmentType,
                eventDate: subjectEvents.testName + ' - ' + subjectEvents.eventDate
            }

            const [justification] = await db
            .select()
            .from(absenceJustification)
            .where(
                and(
                    eq(absenceJustification.testEventId, eventId),
                    eq(absenceJustification.justificationType, 'test'),
                    eq(absenceJustification.status, 'pending')
                ),
            );

            const base64File = justification?.fileData.toString('base64');

            return c.json({ subjectEvent, justification: { ...justification, fileData: base64File } });
        }
        
        
    })
    .post("/event/:type/:eventId", studentMiddleware, 
        zValidator('param', z.object({ eventId: z.coerce.number(), type: z.nativeEnum(JustificationType) })),
        zValidator('form', createJustificationSchima),

        async (c) => {
            const student = c.get("student");
            const { eventId, type } = c.req.valid('param');
            const { notes, image } = c.req.valid('form');

            let imageData : Buffer = Buffer.alloc(0);
            let mimeType = '';
            const submit_date = new Date().toISOString().split('T')[0];;

            if (image instanceof File) {
                // Convert File to binary data
                const arrayBuffer = await image.arrayBuffer();
                imageData = Buffer.from(arrayBuffer);
                mimeType = image.type;
            }

            if(type === JustificationType.SESSION) {
        
            //check if absence exists and owner is student
            const [subjectEvent] = await db
                .select()
                .from(studentSubjectEvent)
                .where(
                    and(
                        eq(studentSubjectEvent.studentId, student.id),
                        eq(studentSubjectEvent.id, eventId),
                        // eq(studentSubjectEvent.event, Events.ABSENCE),
                    ),
                );
            if (!subjectEvent) return c.json({ error: "Subject event not found" }, 404);

            //check if there is already a justification
            const [justificationExists] = await db
                .select()
                .from(absenceJustification)
                .where(
                    and(
                        eq(absenceJustification.subjectEventId, eventId),
                        eq(absenceJustification.justificationType, 'session'),
                        eq(absenceJustification.status, 'pending'),
                    ),
                );
            if (justificationExists) return c.json({ error: "there already is a pending justification" }, 400);

            const [justification] = await db.insert(absenceJustification).values({
                subjectEventId: subjectEvent.id,
                justificationType: 'session',
                notes,
                fileData: imageData,
                fileType: mimeType,
                submitDate: submit_date,
            }).returning();
            
            return c.json({ justification });
            }
            else {
                const [subjectEvents] = await db.select()
                .from(assessmentTestEvent)
                .where(
                    and(
                        eq(assessmentTestEvent.studentId, student.id),
                        eq(assessmentTestEvent.id, eventId),
                    ),
                )
                if (!subjectEvents) return c.json({ error: "Subject event not found" }, 404);

                const [justificationExists] = await db
                .select()
                .from(absenceJustification)
                .where(
                    and(
                        eq(absenceJustification.testEventId, eventId),
                        eq(absenceJustification.justificationType, 'test'),
                        eq(absenceJustification.status, 'pending'),
                    ),
                );
                if (justificationExists) return c.json({ error: "there already is a pending justification" }, 400);

                const [justification] = await db.insert(absenceJustification).values({
                    testEventId: eventId,
                    justificationType: 'test',
                    notes,
                    fileData: imageData,
                    fileType: mimeType,
                    submitDate: submit_date,
                }).returning();
                
                return c.json({ justification });
            }   
        })

    .patch("/event/:type/:eventId/:justificationId", studentMiddleware, 
        zValidator('param', z.object({ eventId: z.coerce.number(), justificationId: z.coerce.number(), type: z.nativeEnum(JustificationType) })),
        zValidator('form', createJustificationSchima),

        async (c) => {
            const student = c.get("student");
            const { justificationId } = c.req.valid('param');

            const { notes, image } = c.req.valid('form');

            //check if absence exists and owner is student
            const [justificationExist] = await db
                .select()
                .from(absenceJustification)
                .leftJoin(studentSubjectEvent, eq(studentSubjectEvent.id, absenceJustification.subjectEventId))
                .leftJoin(assessmentTestEvent, eq(assessmentTestEvent.id, absenceJustification.testEventId))
                .where(
                    and(
                        eq(absenceJustification.id, justificationId),
                        eq(absenceJustification.status, 'pending'),
                        or(
                            eq(studentSubjectEvent.studentId, student.id),
                            eq(assessmentTestEvent.studentId, student.id)
                        )
                    ),
                )
            if (!justificationExist) return c.json({ error: "Subject event not found" }, 404);


            
            let imageData : Buffer = Buffer.alloc(0);
            let mimeType = '';
            const submit_date = new Date().toISOString().split('T')[0];;

            if (image instanceof File) {
                // Convert File to binary data
                const arrayBuffer = await image.arrayBuffer();
                imageData = Buffer.from(arrayBuffer);
                mimeType = image.type;

                const [justification] = await db.update(absenceJustification).set({
                    notes,
                    fileData: imageData,
                    fileType: mimeType,
                    submitDate: submit_date,
                }).where(
                    eq(absenceJustification.id, justificationId)
                ).returning();
                return c.json({ justification });
            }


            const [justification] = await db.update(absenceJustification).set({
                notes,

            }).where(
                eq(absenceJustification.id, justificationId)
            ).returning();
            
            return c.json({ justification });
        }) 

    .delete("/:justificationId", studentMiddleware, 
        zValidator('param', z.object({justificationId: z.coerce.number() })),
        async (c) => {
            const student = c.get("student");
            const { justificationId } = c.req.valid('param');

            const [justificationExist] = await db
                .select()
                .from(absenceJustification)
                .leftJoin(studentSubjectEvent, eq(studentSubjectEvent.id, absenceJustification.subjectEventId))
                .leftJoin(assessmentTestEvent, eq(assessmentTestEvent.id, absenceJustification.testEventId))
                .where(
                    and(
                        eq(absenceJustification.id, justificationId),
                        eq(absenceJustification.status, 'pending'),
                        or(
                            eq(studentSubjectEvent.studentId, student.id),
                            eq(assessmentTestEvent.studentId, student.id)
                        )
                    ),
                )
            if (!justificationExist) return c.json({ error: "Subject event not found" }, 404);

            const [justification] = await db.delete(absenceJustification)
                .where( eq(absenceJustification.id, justificationId) )
                .returning();
            
            
            return c.json({ justification });
        })

export default app


