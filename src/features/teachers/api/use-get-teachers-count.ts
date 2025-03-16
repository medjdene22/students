import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeachersCount = () => {
    return useQuery({
        queryKey: ["teachers-count"],
        queryFn: async () => {
            const response = await client.api.teacher.count.$get();
            if (!response.ok) {
                throw new Error("Failed to fetch teachers count");
            }
            const {count} = await response.json(); 
            return count;
        }
    });
};