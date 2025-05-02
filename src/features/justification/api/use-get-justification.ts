import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetJustification = ({ 
  justificationId,
}: { 
  justificationId: string
}) => {

  const query = useQuery({
    queryKey: ["justification", justificationId],
    queryFn: async () => {
      const response = await client.api.justification[":justificationId"]["$get"]({
        param: { justificationId }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch justification details");
      }
      
      const {justification, subjectEvent} = await response.json();
      return {justification, subjectEvent};
    },
  });
  
  return query;
};