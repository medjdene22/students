import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.major.$post, 200>;
type RequestType = InferRequestType<typeof client.api.major.$post>;

export const useCreateMajor = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json}) => {
      const response  = await client.api.major.$post({json});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Major created");
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};