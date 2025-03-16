import { db } from "@/db"
import { major } from "@/db/schema"

export const getMajors = async () => {
    return await db.select().from(major)
}

// export const getSpecialties = async (majorId: number) => {
//     return await db.select().from(major).where(major.id.eq(majorId))
// }