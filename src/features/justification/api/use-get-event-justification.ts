import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetEventJustification = ({
  eventId, type
}: { 
  eventId: string ,
  type: "session" | "test"
}) => {

  console.log(["justification", type ,eventId])
  const query = useQuery({
    queryKey: ["justification", type ,eventId],
    queryFn: async () => {
      const response = await client.api.justification["event"][":type"][":eventId"]["$get"]({
        param: { eventId, type }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }
      
      return await response.json();
    },
  });
  
  return query;
};