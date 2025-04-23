import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTest = ({ 
  teacherAssignmentId, 
  testId 
}: { 
  teacherAssignmentId: string,
  testId: string 
}) => {
  console.log(["tests", teacherAssignmentId, testId])

  const query = useQuery({
    queryKey: ["tests", teacherAssignmentId, testId],
    queryFn: async () => {
      const response = await client.api.test[":teacherAssignmentId"][":testId"]["$get"]({
        param: { teacherAssignmentId, testId }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch test details");
      }
      
      return await response.json();
    },
    enabled: !!teacherAssignmentId && !!testId
  });
  
  return query;
};