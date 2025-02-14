import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import { auth } from '@/lib/auth';
import { sessionMiddleware } from '@/lib/session-middleware';
import authentication from '@/features/auth/server/route';
import major from '@/features/major/server/route';
import specialtie from '@/features/specialtie/server/route';
import group from '@/features/student-group/server/route';

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
routes.get('test', async (c) => {
    return c.json({test: 'test ok'})
})
    
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;