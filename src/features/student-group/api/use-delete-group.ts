import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.group[':id']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.group[':id']['$delete']>

export const useDeleteGroup = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.group[':id']['$delete']({param});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({ groupDeleted}) => {
            queryClient.invalidateQueries({ queryKey: ["groups", groupDeleted.specialtyId.toString()] });
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            queryClient.invalidateQueries({ queryKey: ["group", groupDeleted.id.toString()] });
            toast.success(`group ${groupDeleted.name} deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};