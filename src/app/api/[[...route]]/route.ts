import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import { auth } from '@/lib/auth';
import { sessionMiddleware } from '@/lib/session-middleware';
import authentication from '@/features/auth/server/route';
import major from '@/features/major/server/route';
import specialtie from '@/features/specialtie/server/route';
import group from '@/features/student-group/server/route';
import student from '@/features/students/server/route';
import teacher from '@/features/teachers/server/route';
import subject from '@/features/subject/server/route';
import teacherAssignment from '@/features/teacher-assignment/server/route';

import teacherUser from '@/features/teacher-user/server/route';
import studentUser from '@/features/student-user/server/route';
import test from '@/features/test/server/route';
import justification from '@/features/justification/server/route';

const app = new Hono().basePath('/api')

const routes = app
    .use(sessionMiddleware)
    .on(["POST", "GET"], "/auth/*", (c) => {
        return auth.handler(c.req.raw);
    })
    .route("/authentication", authentication)
    .route("/major", major)
    .route("/specialtie", specialtie)
    .route("/group", group)
    .route("/student", student)
    .route("/teacher", teacher)
    .route("/subject", subject)
    .route("/teacherAssignment", teacherAssignment)
    .route("/teacherUser", teacherUser)
    .route("/studentUser", studentUser)
    .route("/test", test)
    .route("/justification", justification)

// routes.get('/users', async (c) => {
//     const users = await auth.api.listUsers({headers: c.req.raw.headers, query: {}});
//         // {
//         //     headers: c.req.raw.headers,
//         //     body: {
//         //         email: 'test3@imad.ma',
//         //         name: 'test3',
//         //         password: '123456',
//         //         role: 'student',
//         //         data: {
//         //             username: 'test3',
//         //         }
//         //     }
//         // }
    
//     return c.json({users})
// })
routes.get('/create_user', async (c) => {
    const user = await auth.api.signUpEmail(
        
        {
            headers: c.req.raw.headers,
            body: {
                email: 'admin@admin.com',
                name: 'admin',
                password: 'imadimad',
                role: 'student',
                data: {
                    username: 'admin',
                }
            }
        })
    
    return c.json({user})
})
    
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;