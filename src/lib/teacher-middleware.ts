import { createMiddleware } from "hono/factory";
import { Role } from "@/lib/types"
import { AdditionalContext } from "./session-middleware";



export const teacherMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {
        const user = c.get("user");
        if (!user || user.role !== Role.TEACHER) {
            return c.json({ success: false, message: 'Unauthorized, you are not a teacher' }, 401);
        }
        c.set("teacher", user)
        return next();
    }
);