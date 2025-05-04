import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudentSummary = ({
      subjectId,
    }: {
      subjectId: number;
    }) => {

    const query = useQuery({
      queryKey: ["summary", subjectId],
      queryFn: async () => {
        const response = await client.api.studentUser.summary[":subjectId"].$get({
          param: {
            subjectId: subjectId.toString(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student events");
        }

        return await response.json();
      },
      enabled: !!subjectId,
    });

  return query;
};