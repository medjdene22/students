import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { Role } from "@/lib/types";

type ResponseType = InferResponseType<
  (typeof client.api.justification.verify.teacher)[':justificationId']["$post"]
,  201>;
type RequestType = InferRequestType<
  (typeof client.api.justification.verify.teacher)[':justificationId']["$post"]
>;

export const useVerifyJustification = ({role}: { role: Role }) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response =  role === Role.ADMIN 
        ? await client.api.justification.verify.admin[":justificationId"]["$post"]({ param, json })
        : await client.api.justification.verify.teacher[":justificationId"]["$post"]({ param, json })

      if (!response.ok) {
        const errorData = await response.json() as { error: string };
        throw new Error(errorData.error);
      
      }
      return await response.json();
    },
    onSuccess: ({justification}) => {
      toast.success("justification verified");
      queryClient.invalidateQueries({ queryKey: ["justification", justification.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["justifications"] });
      if(role===Role.ADMIN) return
      queryClient.invalidateQueries({ queryKey: ["student-events"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
