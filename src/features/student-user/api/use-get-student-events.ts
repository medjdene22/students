import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudentEvents = ({
      subjectId,
    }: {
      subjectId: number;
    }) => {

    const query = useQuery({
      queryKey: ["student-events", subjectId],
      queryFn: async () => {
        const response = await client.api.studentUser.events[":subjectId"].$get({
          param: {
            subjectId: subjectId.toString(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student events");
        }

        const { events, subject } = await response.json();

        return { events, subject };
      },
      enabled: !!subjectId,
    });

  return query;
};