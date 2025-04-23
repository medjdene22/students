import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacherGroups = ({ specialtySubjectId }: { specialtySubjectId: number }) => {
    const query = useQuery({
        queryKey: ["teacher", "groups", specialtySubjectId],
        queryFn: async () => {
            const response = await client.api.teacherUser.groups[":specialtySubjectId"].$get({
                param: { specialtySubjectId: String(specialtySubjectId) }
            });
            if (!response.ok) {
                throw new Error("failed to fetch teacher's groups");
            }
            const { groups } = await response.json();
            return groups;
        },
    });
    return query;
}