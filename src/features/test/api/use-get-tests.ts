import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTests = ({ teacherAssignmentId }: { teacherAssignmentId: string }) => {
    const query = useQuery({
        queryKey: ["tests", teacherAssignmentId],
        queryFn: async () => {
            const response = await client.api.test[":teacherAssignmentId"]['$get']({
                param: { teacherAssignmentId }
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch tests");
            }
            
            const { tests, assignment } = await response.json();
            return { tests, assignment };
        },
        enabled: !!teacherAssignmentId
    });
    
    return query;
};
