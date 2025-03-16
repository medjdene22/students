import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.student.$post, 200>;
type RequestType = InferRequestType<typeof client.api.student.$post>;

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json}) => {
      const response  = await client.api.student.$post({json});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({student}) => {
      toast.success("Student created");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", student.groupId?.toString()] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};