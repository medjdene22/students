import { db } from "@/db";
import {
  specialties,
  specialtySubject,
  studentGroup,
  studentInformation,
  studentSubjectEvent,
  studentSubjectSchima,
  subject,
  teacherAssignment,
  teacherAssignmentSchima,
  user,
} from "@/db/schema";
import { adminMiddleware } from "@/lib/admin-middleware";
import { AdditionalContext } from "@/lib/session-middleware";
import { teacherMiddleware } from "@/lib/teacher-middleware";
import { zValidator } from "@hono/zod-validator";
import { group } from "console";
import { sql, eq, and, count } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono<AdditionalContext>()
  .use(teacherMiddleware)
  .get("/whoami", async (c) => {
    const teacher = c.get("teacher");
    return c.json({ teacher });
  })
  .get(  "subject/:id",
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const teacher = c.get("teacher");
      const { id } = c.req.valid("param");
      const [assignment] = await db
        .select()
        .from(teacherAssignment)
        .where(
          and(
            eq(teacherAssignment.teacherId, teacher.id),
            eq(teacherAssignment.specialtySubjectId, id),
          ),
        );

      return c.json({ assignment });
    },
  )

  .get("/subjects", async (c) => {
    const teacher = c.get("teacher");
    const subjects = await db
      .selectDistinctOn([specialtySubject.id], {
        subjectName: subject.name,
        specialtySubjectId: specialtySubject.id,
        specialtyName: specialties.name,
        year: specialtySubject.year,
      })
      .from(teacherAssignment)
      .where(eq(teacherAssignment.teacherId, teacher.id))
      .innerJoin(
        specialtySubject,
        eq(specialtySubject.id, teacherAssignment.specialtySubjectId),
      )
      .innerJoin(specialties, eq(specialties.id, specialtySubject.specialtyId))
      .innerJoin(subject, eq(subject.id, specialtySubject.subjectId));

    return c.json({ subjects });
  })
  .get(  "/groups/:specialtySubjectId",
    zValidator("param", z.object({ specialtySubjectId: z.coerce.number() })),
    async (c) => {
      const teacher = c.get("teacher");
      const { specialtySubjectId } = c.req.valid("param");
      const groups = await db
        .select({
          teacherAssignmentId: teacherAssignment.id,
          groupId: studentGroup.id,
          groupName: studentGroup.name,
          assignment: teacherAssignment.assessment_type,
        })
        .from(teacherAssignment)
        .where(
          and(
            eq(teacherAssignment.teacherId, teacher.id),
            eq(teacherAssignment.specialtySubjectId, specialtySubjectId),
          ),
        )
        .innerJoin(
          studentGroup,
          eq(studentGroup.id, teacherAssignment.groupId),
        );

      return c.json({ groups });
    },
  )

  .get("groupinfo/:teacherAssignmentId",
    zValidator("param", z.object({ teacherAssignmentId: z.coerce.number() })),
    async (c) => {
      const teacher = c.get("teacher");
      const { teacherAssignmentId } = c.req.valid("param");

      const [assignment] = await db
        .select({
          teacherAssignmentId: teacherAssignment.id,
          groupId: teacherAssignment.groupId,
          assignment: teacherAssignment.assessment_type,
        })
        .from(teacherAssignment)
        .where(
          and(
            eq(teacherAssignment.teacherId, teacher.id),
            eq(teacherAssignment.id, teacherAssignmentId),
          ),
        )
        console.log(assignment)
      return c.json({assignment})
    }
  )
  
  .get(  "/group/:teacherAssignmentId",
    zValidator("param", z.object({ teacherAssignmentId: z.coerce.number() })),
    async (c) => {
      const teacher = c.get("teacher");
      const { teacherAssignmentId } = c.req.valid("param");

      // Verify teacher has access to this assignment
      const [assignment] = await db
        .select({
          id: teacherAssignment.id,
          groupId: teacherAssignment.groupId,
          specialtySubjectId: teacherAssignment.specialtySubjectId,
          assessment_type: teacherAssignment.assessment_type,
          subjectName: subject.name,
        })
        .from(teacherAssignment)
        .where(
          and(
            eq(teacherAssignment.teacherId, teacher.id),
            eq(teacherAssignment.id, teacherAssignmentId),
          ),
        ).innerJoin(specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId))
        .innerJoin(subject, eq(subject.id, specialtySubject.subjectId))

        
      const students = await db
        .select({
            // teacherAssignmentId: teacherAssignment.id,
          studentId: studentInformation.studentId,
          name: user.name,
          email: user.email,
          participationNumber: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END)`,
          absenceNumber: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END)`,
          assignmentGrade: sql<number>`
              CAST(
                  2 +
                  LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END) * 0.5, 3) -
                  LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END) * 0.5, 2)
                  AS NUMERIC(3,1)
              )
          `,
          totalAbsence: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END)`,
          totalParticipation: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' THEN 1 END)`,
          subjectStatus: sql<string>`
                            CASE
                                WHEN COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END) >= 3 THEN 'excluded'
                                ELSE 'enrolled'
                            END
                            `
        })
        .from(teacherAssignment).where(
          and( 
            eq(teacherAssignment.groupId, assignment.groupId),
            eq(teacherAssignment.specialtySubjectId, assignment.specialtySubjectId)
          )
        )
        .innerJoin(studentGroup, eq(studentGroup.id, teacherAssignment.groupId))
        .innerJoin(studentInformation,eq(studentInformation.groupId, studentGroup.id),)
        .innerJoin(user, eq(user.id, studentInformation.studentId))
        .leftJoin(studentSubjectEvent, and(eq(studentSubjectEvent.studentId, user.id), eq(studentSubjectEvent.teacherAssignmentId, teacherAssignment.id)))        .groupBy(studentInformation.studentId, user.name, user.email);

      return c.json({ assignment, students });
    },
  )

  .get("/student-events/:teacherAssignmentId/date/:eventDate", zValidator("param", z.object({ teacherAssignmentId: z.coerce.number(), eventDate: z.string() })), async (c) => {
    const teacher = c.get("teacher");
    const { teacherAssignmentId, eventDate } = c.req.valid("param");

    const [assignment] = await db
      .select()
      .from(teacherAssignment)
      .where(
        and(
          eq(teacherAssignment.teacherId, teacher.id),
          eq(teacherAssignment.id, teacherAssignmentId),
        ),
      );

    if (!assignment) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [day, month, year] = eventDate.split('-').map(Number);
    const revisedDate = new Date(Date.UTC(year, month - 1, day));
    const dateToSherch = revisedDate.toISOString().split('T')[0];

    const events = await db
      .select({
        eventId: studentSubjectEvent.id,
        event: studentSubjectEvent.event,
        studentId: user.id,
        studentName: user.name,
        teacherAssignmentId: teacherAssignment.id,
        eventDate: studentSubjectEvent.eventDate,
      })
      .from(teacherAssignment)
        .where(
          and(
            eq(teacherAssignment.teacherId, teacher.id),
            eq(teacherAssignment.id, teacherAssignmentId),
          ),
        )
      .innerJoin(studentGroup, eq(studentGroup.id, teacherAssignment.groupId))
      .innerJoin(studentInformation,eq(studentInformation.groupId, studentGroup.id),)
      .innerJoin(user, eq(user.id, studentInformation.studentId))
      .leftJoin(studentSubjectEvent, and(eq(studentSubjectEvent.studentId, studentInformation.studentId), eq(studentSubjectEvent.teacherAssignmentId, teacherAssignmentId), eq(studentSubjectEvent.eventDate,  dateToSherch)))


    return c.json({ events: events.map(event => ({
      ...event,
      eventDate
    }))
      
     });
  })
  
  .get(  "/student-events/:teacherAssignmentId/student/:studentId",
    zValidator(
      "param",
      z.object({
        teacherAssignmentId: z.coerce.number(),
        studentId: z.string(),
      }),
    ),
    async (c) => {
      const teacher = c.get("teacher");
      const { teacherAssignmentId, studentId } = c.req.valid("param");

      // Verify teacher has access to this assignment
      const [assignment] = await db
        .select({
          id: teacherAssignment.id,
          groupId: teacherAssignment.groupId,
          specialtySubjectId: teacherAssignment.specialtySubjectId,
          assessment_type: teacherAssignment.assessment_type,
          subjectName: subject.name,
        })
        .from(teacherAssignment)
        .where(
          and(
            eq(teacherAssignment.teacherId, teacher.id),
            eq(teacherAssignment.id, teacherAssignmentId),
          ),
        ).innerJoin(specialtySubject, eq(specialtySubject.id, teacherAssignment.specialtySubjectId))
        .innerJoin(subject, eq(subject.id, specialtySubject.subjectId))
        

      if (!assignment)  return c.json({ error: "Unauthorized" }, 401);

      const events = await db
        .select({
          id: studentSubjectEvent.id,
          event: studentSubjectEvent.event,
          eventDate: studentSubjectEvent.eventDate,
        })
        .from(studentSubjectEvent)
        .where(
          and(
            eq(studentSubjectEvent.studentId, studentId),
            eq(studentSubjectEvent.teacherAssignmentId, teacherAssignmentId),
          ),
        )
        .orderBy(studentSubjectEvent.eventDate);

      const [student] = await db
        .select({
          name: user.name,
          email: user.email, 
        })
        .from(user).where(eq(user.id, studentId))
      
      if (!student)  return c.json({ error: "Student not found" }, 404);
      

      const [studentSubject] = await db
        .select({
          studentId : studentSubjectEvent.studentId,
          participationNumber: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END)`,
          absenceNumber: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END)`,
          assignmentGrade: sql<number>`
              CAST(
                  2 +
                  LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END) * 0.5, 3) -
                  LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' AND ${studentSubjectEvent.teacherAssignmentId} = ${assignment.id} THEN 1 END) * 0.5, 2)
                  AS NUMERIC(3,1)
              )
          `,
          totalAbsence: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END)`,
          totalParticipation: sql<number>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' THEN 1 END)`,
          subjectStatus: sql<string>`
                            CASE
                                WHEN COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END) >= 3 THEN 'excluded'
                                ELSE 'enrolled'
                            END
                            `
        })
        .from(teacherAssignment).where(
          and( 
            eq(teacherAssignment.groupId, assignment.groupId),
            eq(teacherAssignment.specialtySubjectId, assignment.specialtySubjectId)
          )
        )
        .leftJoin(studentSubjectEvent, and(eq(studentSubjectEvent.studentId, studentId), eq(studentSubjectEvent.teacherAssignmentId, teacherAssignment.id)))
        .groupBy(studentSubjectEvent.studentId)

      return c.json({ events, student, studentSubject, assignment });
    },
  )

  .post(  "/student-event", zValidator( "json", studentSubjectSchima.omit({ id: true }) ),
    async (c) => {
      const teacher = c.get("teacher");
      const { studentId, teacherAssignmentId, event, eventDate } = c.req.valid("json");

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

      const [day, month, year] = eventDate.split('-').map(Number);
      const revisedDate = new Date(Date.UTC(year, month - 1, day));
      const dateToStore = revisedDate.toISOString().split('T')[0];

      const [existingEvent] = await db
      .select()
      .from(studentSubjectEvent)
      .where(
        and(
          eq(studentSubjectEvent.studentId, studentId),
          eq(studentSubjectEvent.teacherAssignmentId, teacherAssignmentId),
          eq(studentSubjectEvent.eventDate, dateToStore)
        )
      );

      
      if (existingEvent) {
          const [resultEvent] = await db
          .update(studentSubjectEvent)
          .set({
            event,
          })
          .where(
            and(
              eq(studentSubjectEvent.studentId, studentId),
              eq(studentSubjectEvent.teacherAssignmentId, teacherAssignmentId),
              eq(studentSubjectEvent.eventDate, dateToStore)
            )
          ).returning();


        return c.json({ event: {
          ...resultEvent,
          eventDate: eventDate
        } });

      }else{

      const [resultEvent] = await db
          .insert(studentSubjectEvent)
          .values({
            studentId,
            teacherAssignmentId,
            event,
            eventDate: dateToStore
          })
          .returning();
          
        return c.json({ event: {
          ...resultEvent,
          eventDate: eventDate
        } });  

      } 
      
    },
  )

  .delete(  "/student-event/:id",
      zValidator(
      "param",
      z.object({
          id: z.coerce.number(),
      }),
      ),
      async (c) => {
      const teacher = c.get("teacher");
      const { id } = c.req.valid("param");

      // Get the event and verify it belongs to an assignment this teacher has access to
      const [event] = await db
          .select()
          .from(studentSubjectEvent)
          .where(eq(studentSubjectEvent.id, id));

      if (!event) {
          return c.json({ error: "Event not found" }, 404);
      }

      const [assignment] = await db
          .select()
          .from(teacherAssignment)
          .where(
          and(
              eq(teacherAssignment.teacherId, teacher.id),
              eq(teacherAssignment.id, event.teacherAssignmentId),
          ),
          );

      if (!assignment) {
          return c.json({ error: "Unauthorized" }, 401);
      }

      const [deletedEvent] = await db
          .delete(studentSubjectEvent)
          .where(eq(studentSubjectEvent.id, id))
          .returning();
      
      const dateToReturn = deletedEvent.eventDate.split('-').reverse().join('-');

      return c.json({ deletedEvent: { ...deletedEvent, eventDate: dateToReturn } });
      },
  )

export default app;
