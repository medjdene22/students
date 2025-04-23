import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacherSubjects = () => {
    const query = useQuery({
        queryKey: ["teacher", "subjects"],
        queryFn: async () => {
            const response = await client.api.teacherUser.subjects.$get();
            if (!response.ok) {
                throw new Error("failed to fetch teacher subjects");
            }
            const { subjects } = await response.json();
            return subjects;
        }
    });
    return query;
}