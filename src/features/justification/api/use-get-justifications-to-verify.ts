import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { JustificationStatus, Role } from "@/lib/types";

export const useGetJustificationsToVerify = ({ status, role}: { status: JustificationStatus, role: Role }) => {

  const query = useQuery({
    queryKey: ["justifications", status],
    queryFn: async () => {
      const response = role === Role.ADMIN 
        ? await client.api.justification.verify.admin["$get"]({ query: {status}})
        : await client.api.justification.verify.teacher["$get"]({ query: {status}})
      
      if (!response.ok) {
        throw new Error("Failed to fetch justifications");
      }
      
      return await response.json();
    },
  });
  
  return query;
};