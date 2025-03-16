import { db } from "@/db"
import { major } from "@/db/schema"

export const getMajors = async () => {
    return await db.select().from(major)
}