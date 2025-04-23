import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.subject[':id']["specialty"]['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.subject[':id']["specialty"]['$delete']>;

export const useDeleteSubjectSpecaltie = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.subject[':id']["specialty"]['$delete']({param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({subjectSpecialtyDeleted}) => {
      toast.success("Subject removed from specialty");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["subjectSpecalties", subjectSpecialtyDeleted.subjectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["specialtySubjects", subjectSpecialtyDeleted.specialtyId.toString()] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};