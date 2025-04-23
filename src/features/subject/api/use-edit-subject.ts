import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.subject[':id']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.subject[':id']['$patch']>;

export const useEditSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response  = await client.api.subject[':id']['$patch']({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({subjectUpdated}) => {
      toast.success("Subject updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subject", subjectUpdated.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};