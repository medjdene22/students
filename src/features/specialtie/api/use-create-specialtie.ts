import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.specialtie.$post, 200>;
type RequestType = InferRequestType<typeof client.api.specialtie.$post>;

export const useCreateSpecialtie = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json}) => {
      const response  = await client.api.specialtie.$post({json});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({specialtieCreated}) => {
      toast.success("Specialtie created");
      queryClient.invalidateQueries({ queryKey: ["specialties", specialtieCreated.majorId.toString()] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};