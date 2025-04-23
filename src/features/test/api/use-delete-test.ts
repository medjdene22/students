import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.test[":teacherAssignmentId"][":testId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.test[":teacherAssignmentId"][":testId"]["$delete"]>;

export const useDeleteTest = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.test[":teacherAssignmentId"][":testId"]["$delete"]({ param });
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      return await response.json();
    },
    onSuccess: ({ test }) => {
      toast.success("Test deleted successfully");
      queryClient.invalidateQueries({ 
        queryKey: ["tests", test.assessmentId.toString()]
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
