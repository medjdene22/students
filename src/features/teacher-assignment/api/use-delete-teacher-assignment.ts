import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.teacherAssignment[':assignmentId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.teacherAssignment[':assignmentId']['$delete']>;

export const useDeleteTeacherAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.teacherAssignment[':assignmentId']['$delete']({param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({deletedAssignment}) => {
      toast.success("Teacher assignment deleted");
      queryClient.invalidateQueries({ 
        queryKey: ["teacher-assignments", deletedAssignment.groupId.toString()] 
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};