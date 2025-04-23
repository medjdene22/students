import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.teacherAssignment[":groupId"]['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.teacherAssignment[":groupId"]['$post']>;

export const useCreateTeacherAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.teacherAssignment[':groupId']['$post']({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({assignmentCreated}) => {
      toast.success("Teacher assignment created");
      queryClient.invalidateQueries({ 
        queryKey: ["teacher-assignments", assignmentCreated.groupId.toString()] 
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};