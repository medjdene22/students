import { db } from "@/db";
import {
  specialties,
  specialtySubject,
  studentGroup,
  studentInformation,
  studentSubjectEvent,
  subject,
  teacherAssignment,
  user,
} from "@/db/schema";
import { AdditionalContext } from "@/lib/session-middleware";
import { studentMiddleware } from "@/lib/student-middleware";
import { zValidator } from "@hono/zod-validator";
import { sql, eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono<AdditionalContext>()
  .use(studentMiddleware)
  
  .get("/whoami", async (c) => {
    const student = c.get("student");
    
    return c.json({ student });
  })

  .get("/group", async (c) => {
    const student = c.get("student");
    
    const [studentInfo] = await db
      .select({
        id: studentInformation.id,
        groupId: studentInformation.groupId,
      })
      .from(studentInformation)
      .where(eq(studentInformation.studentId, student.id));
      
    if (!studentInfo?.groupId) {
      return c.json({ error: "Student not assigned to a group" }, 404);
    }
    
    const [group] = await db
      .select({
        id: studentGroup.id,
        name: studentGroup.name,
        section: studentGroup.section,
        year: studentGroup.year,
        specialtyId: studentGroup.specialtyId,
        specialtyName: specialties.name,
        cycleName: specialties.cycle,
      })
      .from(studentGroup)
      .innerJoin(specialties, eq(specialties.id, studentGroup.specialtyId))
      .where(eq(studentGroup.id, studentInfo.groupId));
      
    return c.json({ group });
  })

  .get("/subjects", async (c) => {
    const student = c.get("student");
    
    const [studentInfo] = await db
      .select({
        groupId: studentInformation.groupId,
      })
      .from(studentInformation)
      .where(eq(studentInformation.studentId, student.id));
      
    if (!studentInfo?.groupId) {
      return c.json({ error: "Student not assigned to a group" }, 404);
    }
    
    const [groupData] = await db
      .select({
        specialtyId: studentGroup.specialtyId,
        year: studentGroup.year,
      })
      .from(studentGroup)
      .where(eq(studentGroup.id, studentInfo.groupId));
    
    const subjects = await db
      .select({
        id: specialtySubject.id,
        subjectId: specialtySubject.subjectId,
        subjectName: subject.name,
        year: specialtySubject.year,
      })
      .from(specialtySubject)
      .innerJoin(subject, eq(subject.id, specialtySubject.subjectId))
      .where(
        and(
          eq(specialtySubject.specialtyId, groupData.specialtyId),
          eq(specialtySubject.year, groupData.year)
        )
      );
      
    return c.json({ subjects });
  })

  .get("/events/:subjectId", 
    zValidator("param", z.object({ subjectId: z.coerce.number() })),
    async (c) => {
      const student = c.get("student");
      const { subjectId } = c.req.valid("param");
      
      // Get subject info
      const [subjectInfo] = await db
        .select({
          id: specialtySubject.id,
          subjectName: subject.name,
        })
        .from(specialtySubject)
        .innerJoin(subject, eq(subject.id, specialtySubject.subjectId))
        .where(eq(specialtySubject.id, subjectId));
        
      if (!subjectInfo) {
        return c.json({ error: "Subject not found" }, 404);
      }
      
      // Get student's group
      const [studentInfo] = await db
        .select({
          groupId: studentInformation.groupId,
        })
        .from(studentInformation)
        .where(eq(studentInformation.studentId, student.id));
        
      // Get teacher assignments for this subject and group
      const teacherAssignments = await db
        .select({
          id: teacherAssignment.id,
          teacherId: teacherAssignment.teacherId,
          teacherName: user.name,
          assessmentType: teacherAssignment.assessment_type,
        })
        .from(teacherAssignment)
        .innerJoin(user, eq(user.id, teacherAssignment.teacherId))
        .where(
          and(
            eq(teacherAssignment.specialtySubjectId, subjectId),
            eq(teacherAssignment.groupId, studentInfo.groupId!)
          )
        );
      
      // Get all events for this student in this subject
      const events = await db
        .select({
          id: studentSubjectEvent.id,
          event: studentSubjectEvent.event,
          eventDate: studentSubjectEvent.eventDate,
          teacherAssignmentId: studentSubjectEvent.teacherAssignmentId,
          assessmentType: teacherAssignment.assessment_type,
          teacherName: user.name,
        })
        .from(studentSubjectEvent)
        .innerJoin(
          teacherAssignment, 
          eq(teacherAssignment.id, studentSubjectEvent.teacherAssignmentId)
        )
        .innerJoin(user, eq(user.id, teacherAssignment.teacherId))
        .where(
          and(
            eq(studentSubjectEvent.studentId, student.id),
            eq(teacherAssignment.specialtySubjectId, subjectId)
          )
        )
        .orderBy(studentSubjectEvent.eventDate);
        
      // Get summary statistics
      const [summary] = await db
        .select({
          participationNumber: sql<number>`
            COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' THEN 1 END)
          `,
          absenceNumber: sql<number>`
            COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END)
          `,
          grade: sql<number>`
            CAST(
              2 +
              LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' THEN 1 END) * 0.5, 3) -
              LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END) * 0.5, 2)
              AS NUMERIC(3,1)
            )
          `,
          subjectStatus: sql<string>`
            CASE
              WHEN COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' THEN 1 END) >= 3 THEN 'excluded'
              ELSE 'enrolled'
            END
          `,
        })
        .from(studentSubjectEvent)
        .innerJoin(
          teacherAssignment, 
          eq(teacherAssignment.id, studentSubjectEvent.teacherAssignmentId)
        )
        .where(
          and(
            eq(studentSubjectEvent.studentId, student.id),
            eq(teacherAssignment.specialtySubjectId, subjectId)
          )
        );
        
      const studentSubject = {
        ...subjectInfo,
        teachers: teacherAssignments,
        ...summary
      };
        
      return c.json({ events, subject: studentSubject });
    }
  );

export default app;