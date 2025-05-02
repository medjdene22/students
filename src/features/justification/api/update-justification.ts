import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType< (typeof client.api.justification.event)[":type"][":eventId"][":justificationId"]["$patch"] ,  201>;
type RequestType = InferRequestType< (typeof client.api.justification.event)[":type"][":eventId"][":justificationId"]["$patch"]>;

export const useUpdateJustification = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, form }) => {
      const response = await client.api.justification.event[":type"][":eventId"][":justificationId"]["$patch"]({ param, form });

      if (!response.ok) {
        const errorData = await response.json() as { error: string };
        throw new Error(errorData.error);
      
      }
      return await response.json();
    },
    onSuccess: ({justification}) => {
      toast.success("justification updated");
      const eventId = justification.justificationType === 'test' ? justification.testEventId?.toString() : justification.subjectEventId?.toString()
      queryClient.invalidateQueries({ queryKey: ["justification", justification.justificationType ,eventId] });
      queryClient.invalidateQueries({ queryKey: ["justifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
