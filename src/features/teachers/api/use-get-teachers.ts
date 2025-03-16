import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeachers = () => {
    const query = useQuery({
        queryKey: ["teachers"],
        queryFn: async () => {
            const response = await client.api.teacher.$get();
            if (!response.ok) {
                throw new Error("Failed to fetch teachers");
            }
            const {teachers} = await response.json(); 
            return teachers;
        }
    });
    return query;
};