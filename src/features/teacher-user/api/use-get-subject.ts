import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacherSubject = ({ specialtySubjectId }: { specialtySubjectId: string }) => {
    const query = useQuery({
        queryKey: ["teachersubject", specialtySubjectId],
        queryFn: async () => {
            const response = await client.api.teacherUser.subject[":specialtySubjectId"].$get({
                param: { specialtySubjectId }
            });
            if (!response.ok) {
                throw new Error("failed to teacher subject");
            }
            const {specialtysubject} = await response.json();
            return specialtysubject;
        },
        enabled: !!specialtySubjectId
    });
    return query;
}
