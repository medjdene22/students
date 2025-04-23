import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.subject[":id"]["delete-bulk"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.subject[":id"]["delete-bulk"]["$post"]>;

export const useDeleteSubjectSpecalties = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.subject[":id"]["delete-bulk"]["$post"]({json, param});
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({subjectSpecialtiesDeleted}) => {
      toast.success(subjectSpecialtiesDeleted.length > 1 
        ? `Removed subject from ${subjectSpecialtiesDeleted.length} specialties`
        : "Subject removed from specialty"
      );
      
      // Invalidate relevant queries if there are deleted items
      if (subjectSpecialtiesDeleted.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["subjectSpecalties", subjectSpecialtiesDeleted[0].subjectId.toString()] });
        // Invalidate all potentially affected specialty queries
        subjectSpecialtiesDeleted.forEach(item => {
          queryClient.invalidateQueries({ queryKey: ["specialtySubjects", item.specialtyId.toString()] });
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};