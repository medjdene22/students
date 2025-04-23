import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacher = () => {
    const query = useQuery({
        queryKey: ["teacher", "whoami"],
        queryFn: async () => {
            const response = await client.api.teacherUser.whoami.$get();
            if (!response.ok) {
                throw new Error("failed to fetch teacher data");
            }
            const { teacher } = await response.json(); 
            return teacher;
        }
    });
    return query;
}