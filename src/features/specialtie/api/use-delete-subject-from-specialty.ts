import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.specialtie[':id']["subject"]['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.specialtie[':id']["subject"]['$delete']>;

export const useDeleteSubjectFromSpecialty = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.specialtie[':id']["subject"]['$delete']({param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({specialtySubjectDeleted}) => {
      toast.success("Subject removed from specialty");
      queryClient.invalidateQueries({ queryKey: ["specialtySubjects", specialtySubjectDeleted.specialtyId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["subjectSpecalties", specialtySubjectDeleted.subjectId.toString()] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};