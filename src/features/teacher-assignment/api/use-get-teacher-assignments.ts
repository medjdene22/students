import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacherAssignments = ({id}: {id: string}) => {
    const query = useQuery({
        queryKey: ["teacher-assignments", id],
        queryFn: async () => {
            const response = await client.api.teacherAssignment[":id"].$get({
                param: {id}
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch teacher assignments");
            }
            
            const {teacherAssignments} = await response.json(); 
            return teacherAssignments;
        }
    });
    
    return query;
}