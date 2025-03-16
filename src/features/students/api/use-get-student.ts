import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudent = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await client.api.student[":id"].$get({ param: { id } });
      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }
      const { student } = await response.json();
      return student;
    },
  });
  return query;
};
