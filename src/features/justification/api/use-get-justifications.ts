import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetJustifications = () => {

  const query = useQuery({
    queryKey: ["justifications"],
    queryFn: async () => {
      const response = await client.api.justification["$get"]();
      
      if (!response.ok) {
        throw new Error("Failed to fetch test details");
      }
      
      return await response.json();
    },
  });
  
  return query;
};