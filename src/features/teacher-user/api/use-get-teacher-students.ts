import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacherStudents = ({ teacherSubjectId, teacherAssignmentId }: {teacherSubjectId: string, teacherAssignmentId: string }) => {
  const query = useQuery({
    queryKey: ["students", teacherSubjectId, teacherAssignmentId],
    queryFn: async () => {
      const response = await client.api.teacherUser["group"][":teacherAssignmentId"]["$get"]({
        param: {
          teacherAssignmentId: teacherAssignmentId.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch group");
      }
      return await response.json();
    },

  });

  return query;
};
