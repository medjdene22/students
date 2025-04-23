import { createMiddleware } from "hono/factory";
import { Role } from "@/lib/types"


export const adminMiddleware = createMiddleware(
    async (c, next) => {
        const user = c.get("user");
        if (!user || user.role !== Role.ADMIN) {
            return c.json({ success: false, message: 'Unauthorized, you are not an admin' }, 401);
        }
        return next();
    }
);