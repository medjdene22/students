import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.test[":teacherAssignmentId"][":testId"][":eventId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.test[":teacherAssignmentId"][":testId"][":eventId"]["$delete"]>;

export const useDeleteTestEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.test[":teacherAssignmentId"][":testId"][":eventId"]["$delete"]({ 
        param 
      });
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      return await response.json();
    },
    onSuccess: (_, variables) => {
      toast.success("Test event deleted successfully");
      queryClient.invalidateQueries({ 
        queryKey: ["tests", variables.param.teacherAssignmentId, variables.param.testId]
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};