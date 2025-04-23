import { createMiddleware } from "hono/factory";
import { Role } from "@/lib/types"
import { AdditionalContext } from "./session-middleware";



export const studentMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {
        const user = c.get("user");
        if (!user || user.role !== Role.STUDENT) {
            return c.json({ success: false, message: 'Unauthorized, you are not a student' }, 401);
        }
        c.set("student", user);
        return next();
    }
);