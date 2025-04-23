import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudentSubjects = () => {
    const query = useQuery({
        queryKey: ["student", "subjects"],
        queryFn: async () => {
            const response = await client.api.studentUser.subjects.$get();
            if (!response.ok) {
                throw new Error("failed to fetch student subjects");
            }
            const { subjects } = await response.json();
            return subjects;
        }
    });
    return query;
}