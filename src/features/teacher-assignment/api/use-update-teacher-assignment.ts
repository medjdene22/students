import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.teacherAssignment[":assignmentId"]['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.teacherAssignment[":assignmentId"]['$patch']>;

export const useUpdateTeacherAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.teacherAssignment[":assignmentId"]['$patch']({
        json, 
        param
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({assignmentUpdated}) => {
      toast.success("Teacher assignment updated");
      queryClient.invalidateQueries({ 
        queryKey: ["teacher-assignments", assignmentUpdated.groupId.toString()] 
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};