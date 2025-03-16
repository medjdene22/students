import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTeacher = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: ["teacher", id],
    queryFn: async () => {
      const response = await client.api.teacher[":id"].$get({ param: { id } });
      if (!response.ok) {
        throw new Error("Failed to fetch teacher");
      }
      const { teacher } = await response.json();
      return teacher;
    },
  });
  return query;
};