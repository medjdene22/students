import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.subject[':id']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.subject[':id']['$delete']>

export const useDeleteSubject = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.subject[':id']['$delete']({param});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({subjectDeleted}) => {
            queryClient.invalidateQueries({ queryKey: ["subject", subjectDeleted.id] });
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success(`Subject ${subjectDeleted.name} deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};