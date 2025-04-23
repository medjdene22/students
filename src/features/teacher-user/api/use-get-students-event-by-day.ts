import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudentsEventByDay = ({
      teacherAssignmentId,
      eventDate,
    }: {
      teacherAssignmentId: number;
      eventDate: string;
    }) => {
    const query = useQuery({
      queryKey: ["student-events", teacherAssignmentId, eventDate],
      queryFn: async () => {
        const response = await client.api.teacherUser["student-events"][":teacherAssignmentId"]["date"][":eventDate"]["$get"]({
          param: {
            teacherAssignmentId: teacherAssignmentId.toString(),
            eventDate
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student events");
        }

        const { events } = await response.json();
        return  events;
      },
    });

  return query;
};
