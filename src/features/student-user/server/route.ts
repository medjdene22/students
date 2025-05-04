import { db } from "@/db";
import {
  assessmentTest,
  assessmentTestEvent,
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
import { eq, and, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { JustificationType} from "@/lib/types";

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
        
      
      // Get all events for this student in this subject
      const events = await db
        .select({
          id: studentSubjectEvent.id,
          event: studentSubjectEvent.event,
          eventDate: studentSubjectEvent.eventDate,
          assessmentType: teacherAssignment.assessment_type,
        })
        .from(teacherAssignment)
        .where(
          and(
            eq(teacherAssignment.groupId, studentInfo.groupId!),
            eq(teacherAssignment.specialtySubjectId, subjectId),
          )
        )
        .innerJoin( studentSubjectEvent, 
          and(
            eq(studentSubjectEvent.teacherAssignmentId, teacherAssignment.id),
            eq(studentSubjectEvent.studentId, student.id)
          )
        ).orderBy(studentSubjectEvent.eventDate);

        const TestEvent = await db
          .select(
            {
            id: assessmentTestEvent.id,
            event: assessmentTestEvent.event,
            name: assessmentTest.name,
            date: assessmentTest.testDate,
            assessmentType: teacherAssignment.assessment_type,

          }
        )
          .from(teacherAssignment)
          .where(
            and(
              eq(teacherAssignment.groupId, studentInfo.groupId!),
              eq(teacherAssignment.specialtySubjectId, subjectId),
            )
          )
          .innerJoin(
            assessmentTest,
            eq(teacherAssignment.id, assessmentTest.assessmentId)
          )
          .innerJoin(
            assessmentTestEvent,
            and(
              eq(assessmentTestEvent.studentId, student.id),
              eq(assessmentTestEvent.assessmentTestId, assessmentTest.id),
            )
          )  

      const transformedTestEvents = TestEvent.map(item => {
        return {
          id: item.id,
          type: JustificationType.TEST,
          event: item.event,
          eventDate: item.name + ' - ' + item.date,
          assessmentType: item.assessmentType
        };
      });
      const transformedEvents = events.map(item => {
        return {
          id: item.id,
          type: JustificationType.SESSION,
          event: item.event,
          eventDate: item.eventDate,
          assessmentType: item.assessmentType
        };
      });
      
      const allEvents = [
        ...transformedEvents,
        ...transformedTestEvents
      ];
      return c.json({ events: allEvents });
    }
  )

  .get("/summary/:subjectId", 
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

          
        
      // Get summary statistics
      const assessments = await db
        .select(
          {
            teacherAssignmentId: teacherAssignment.id,
            teacherName: user.name,
            assessmentType: teacherAssignment.assessment_type,
            participationNumber: sql<string>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' AND ${studentSubjectEvent.teacherAssignmentId} = ${teacherAssignment.id} THEN 1 END)`,
            absenceNumber: sql<string>`  COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' AND ${studentSubjectEvent.teacherAssignmentId} = ${teacherAssignment.id} THEN 1 END)`,
            assignmentGrade: sql<string>`
                          CAST(
                              2 +
                              LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'participation' AND ${studentSubjectEvent.teacherAssignmentId} = ${teacherAssignment.id} THEN 1 END) * 0.5, 3) -
                              LEAST(COUNT(CASE WHEN ${studentSubjectEvent.event} = 'absence' AND ${studentSubjectEvent.teacherAssignmentId} = ${teacherAssignment.id} THEN 1 END) * 0.5, 2)
                              AS NUMERIC(3,1)
                          )
                      `,
       
        }
      )
        .from(teacherAssignment).where(
          and(
            eq(teacherAssignment.specialtySubjectId, subjectId),
            eq(teacherAssignment.groupId, studentInfo.groupId!)
          )
        ).innerJoin(user, eq(user.id, teacherAssignment.teacherId))
        .leftJoin(studentSubjectEvent, and(eq(studentSubjectEvent.studentId, student.id), eq(studentSubjectEvent.teacherAssignmentId, teacherAssignment.id)))
        .groupBy(teacherAssignment.id, user.name, teacherAssignment.assessment_type)
        
      const totalAbsence = assessments.reduce((total, assessment) => {
        return total + parseInt(assessment.absenceNumber, 10);
      }, 0);

      const totalParticipation = assessments.reduce((total, assessment) => {
        return total + parseInt(assessment.participationNumber, 10);
      }, 0);
    
      const subjectStatus = totalAbsence >= 3 ? 'excluded' : 'enrolled';

      const studentSubject = {
        subject : {
          ...subjectInfo,
          totalAbsence,
          totalParticipation,
          subjectStatus
        },
        assessments
      };


      return c.json({ studentSubject});
    }
  );

export default app;