import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.teacher[':id']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.teacher[':id']['$patch']>;

export const useEditTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.teacher[':id']['$patch']({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({teacherUpdated}) => {
      toast.success("Teacher updated successfully");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", teacherUpdated.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};