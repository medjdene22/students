import 'server-only'

import { createMiddleware } from 'hono/factory'
import { auth, Session } from './auth'
import { User } from './auth'

export type AdditionalContext = {
    Variables: {
        user: User | null,
        session: Session | null
    }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {

        const session = await auth.api.getSession({ headers: c.req.raw.headers });
 
        if (!session) {
            c.set("user", null);
            c.set("session", null);
            return next();
        }
        c.set("user", session.user);
        c.set("session", session.session);
        return next();
    }
)