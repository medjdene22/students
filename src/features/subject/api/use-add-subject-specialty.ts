import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.subject[":id"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.subject[":id"]["$post"]>;

export const useCreateSubjectSpecaltie = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.subject[":id"]["$post"]({json, param});
      
      if (!response.ok) {
          if (response.status === 409) {
            throw new Error("This subject is already assigned to this specialty for the selected year");
          }
          throw new Error(response.statusText);
        
      }
      
      // Here's the key fix: explicitly type the response data
      const data = await response.json();
      return data;
    },
    onSuccess: ({subjectSpecialtyCreated}) => {
      toast.success("Subject assigned to specialty successfully");
      queryClient.invalidateQueries({ queryKey: ["subjectSpecialties", subjectSpecialtyCreated.subjectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["specialtySubjects", subjectSpecialtyCreated.specialtyId.toString()] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};