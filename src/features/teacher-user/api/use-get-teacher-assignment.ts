import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacherAssignment = ({ id }: { id: number }) => {
    const query = useQuery({
        queryKey: ["teachersubject", id],
        queryFn: async () => {
            const response = await client.api.teacherUser.groupinfo[":teacherAssignmentId"].$get({
                param: { teacherAssignmentId: String(id) }
            });
            if (!response.ok) {
                throw new Error("failed to teacher assignment");
            }
            const {assignment} = await response.json();
            return assignment;
        },
        enabled: !!id
    });
    return query;
}
