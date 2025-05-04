import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Role } from "@/lib/types";

export const useGetJustificationToVerify = ({ justificationId, role }: { justificationId: string, role: Role }) => {

  const query = useQuery({
    queryKey: ["justification", justificationId],
    queryFn: async () => {
      const response = role === Role.ADMIN 
        ? await client.api.justification.verify.admin[":justificationId"].$get({ param: { justificationId },})
        : await client.api.justification.verify.teacher[":justificationId"].$get({ param: { justificationId },});
      
      if (!response.ok) {
        throw new Error("Failed to fetch justification");
      }
      
      return await response.json();
    },
  });
  
  return query;
};