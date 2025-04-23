import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudentEvents = ({
      teacherSubjectId,
      teacherAssignmentId,
      studentId,
    }: {
      teacherSubjectId: string;
      teacherAssignmentId: string;
      studentId: string;
    }) => {

    const query = useQuery({
      queryKey: ["student-events", studentId, teacherSubjectId, teacherAssignmentId],
      queryFn: async () => {
        const response = await client.api.teacherUser["student-events"][":teacherAssignmentId"]["student"][":studentId"]["$get"]({
          param: {
            teacherAssignmentId: teacherAssignmentId.toString(),
            studentId: studentId,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student events");
        }

        return await response.json();
      },
    });

  return query;
};
