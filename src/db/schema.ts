import { pgTable, text, timestamp, boolean, pgEnum, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema} from "drizzle-zod"

export const roleEnum = pgEnum("role", ["admin", "user", "student", "teacher"]);
export const sectionEnum = pgEnum("section", ["section1", "section2", "section3", "section4", "section5"]);
export const cycleEnum = pgEnum("cycle", ["license", "master", "engineer", "PhD"]);
export const yearEnum = pgEnum("year", ["first", "second", "third", "fourth", "fifth"]);
export const teacherGradeEnum = pgEnum("teacher_grade", ["mcb", "mca", "professor", "substitute"]);


export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    username: text('username').unique(),
    role: roleEnum("role").notNull(),
    banned: boolean('banned'),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),
    
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(()=> user.id),
    impersonatedBy: text('impersonated_by')
});

export const account = pgTable("account", {
                    id: text("id").primaryKey(),
                    accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> user.id),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: timestamp('access_token_expires_at'),
 refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
 scope: text('scope'),
 password: text('password'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
                });

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

export const major = pgTable("major", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
  });
export const insertMajorSchima = createInsertSchema(major);

export const specialties = pgTable("specialties", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    cycle: cycleEnum("cycle").notNull(),
    majorId: integer("major_id").references( ()=> major.id , {
      onDelete: "cascade"
    }).notNull()
});
export const insertSpecialtiesSchima = createInsertSchema(specialties);

export const studentGroup = pgTable("student_group", {
  id: serial("id").primaryKey(),
  name: text('name').notNull(),
  section: sectionEnum("section").notNull(),
  year: yearEnum("year").notNull(),
  specialtyId: integer('specialty').references( ()=> specialties.id , {
    onDelete: "cascade"
  }).notNull(),
});
export const insertStudentGroupSchima = createInsertSchema(studentGroup);

export const studentInformation = pgTable("student_info", {
  id: serial("id").primaryKey(),
  studentId: text('student_id').references(()=> user.id, {
    onDelete: "cascade"
  }).notNull(),
  groupId: integer('group_id').references(()=> studentGroup.id, {
    onDelete: "set null"
  }),

});
export const insertStudentInfoSchima = createInsertSchema(studentInformation);

  export const teacherInformation = pgTable("teacher_info", {
    id: serial("id").primaryKey(),
    teacherId: text('teacher_id').references(()=> user.id, {
      onDelete: "cascade"
    }).notNull(),
    grade: teacherGradeEnum("grade").notNull(),
  });
  export const insertTeacherInfoSchima = createInsertSchema(teacherInformation);


export const subject = pgTable("subject", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
});
export const insertSubjectSchima = createInsertSchema(subject);

export const teacherSubject = pgTable("teacher_subject", {
    id: serial("id").primaryKey(),
    subjectId: integer('subject_id').references(()=> subject.id).notNull(),
    teacherId: text('teacher_id').references(()=> user.id).notNull(),
});
export const insertTeacherSubjectSchima = createInsertSchema(teacherSubject);

export const teacherSubjectGroup = pgTable("teacher_subject_group", {
    id: serial("id").primaryKey(),
    teacherId: text('teacher_id').references(()=> user.id).notNull(),
    subjectId: integer('subject_id').references(()=> subject.id).notNull(),
    groupId: integer('group_id').references(()=> studentGroup.id).notNull(),
});
