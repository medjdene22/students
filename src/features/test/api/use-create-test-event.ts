import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.test[":teacherAssignmentId"][":testId"]["$post"], 201>;
type RequestType = InferRequestType<typeof client.api.test[":teacherAssignmentId"][":testId"]["$post"]>;

export const useCreateTestEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.test[":teacherAssignmentId"][":testId"]["$post"]({ 
        json, 
        param 
      });
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      return await response.json();
    },
    onSuccess: (data, variables) => {
      toast.success("Test event created successfully");
      queryClient.invalidateQueries({ 
        queryKey: ["tests", variables.param.teacherAssignmentId, variables.param.testId]
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};