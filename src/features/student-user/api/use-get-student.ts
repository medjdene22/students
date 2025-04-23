import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudent = () => {
    const query = useQuery({
        queryKey: ["student", "whoami"],
        queryFn: async () => {
            const response = await client.api.studentUser.whoami.$get();
            if (!response.ok) {
                throw new Error("failed to fetch student data");
            }
            const { student } = await response.json(); 
            return student;
        }
    });
    return query;
}