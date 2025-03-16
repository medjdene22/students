import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.group[':id']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.group[':id']['$patch']>;

export const useEditGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response  = await client.api.group[':id']['$patch']({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({groupUpdated}) => {
      toast.success("Major updated successfully");
      queryClient.invalidateQueries({ queryKey: ["groups", groupUpdated.specialtyId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", groupUpdated.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};