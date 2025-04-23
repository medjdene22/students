import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudentGroup = () => {
    const query = useQuery({
        queryKey: ["student", "group"],
        queryFn: async () => {
            const response = await client.api.studentUser.group.$get();
            if (!response.ok) {
                throw new Error("failed to fetch student group data");
            }
            const { group } = await response.json(); 
            return group;
        }
    });
    return query;
}