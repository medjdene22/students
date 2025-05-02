import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.justification[':justificationId']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.justification[':justificationId']['$delete']>

export const useDeleteJustification = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.justification[':justificationId']['$delete']({param});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({justification}) => {
            toast.success("justification deleted");
            queryClient.invalidateQueries({ queryKey: ["justification", "event" ,justification.subjectEventId?.toString()] });
            queryClient.invalidateQueries({ queryKey: ["justifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};