import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.student[':id']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.student[':id']['$patch']>;

export const useEditStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.student[':id']['$patch']({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({studentUpdated}) => {
      toast.success("Student updated successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", studentUpdated.groupId?.toString()] });
      queryClient.invalidateQueries({ queryKey: ["student", studentUpdated.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};