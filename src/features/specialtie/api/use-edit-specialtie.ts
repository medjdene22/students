import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.specialtie[':id']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.specialtie[':id']['$patch']>;

export const useEditSpecialtie = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response  = await client.api.specialtie[':id']['$patch']({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({specialtieUpdated}) => {
      toast.success("Specialtie updated");
      queryClient.invalidateQueries({ queryKey: ["specialties", specialtieUpdated.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["specialties", specialtieUpdated.majorId.toString()] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};