import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.specialtie[":id"]["delete-bulk"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.specialtie[":id"]["delete-bulk"]["$post"]>;

export const useDeleteSubjectsFromSpecialty = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.specialtie[":id"]["delete-bulk"]["$post"]({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({specialtySubjectsDeleted}) => {
      toast.success(specialtySubjectsDeleted.length > 1 
        ? `Removed ${specialtySubjectsDeleted.length} subjects from specialty`
        : "Subject removed from specialty"
      );
      
      if (specialtySubjectsDeleted.length > 0) {
        // Invalidate the specialty subjects query
        queryClient.invalidateQueries({ queryKey: ["specialtySubjects", specialtySubjectsDeleted[0].specialtyId.toString()] });
        
        // Invalidate subject specialty queries for each affected subject
        specialtySubjectsDeleted.forEach(item => {
          queryClient.invalidateQueries({ queryKey: ["subjectSpecalties", item.subjectId.toString()] });
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};