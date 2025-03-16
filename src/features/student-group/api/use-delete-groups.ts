import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.group['bulk']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.group['bulk']['$post']>

export const useDeleteGroups = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.group['bulk']['$post']({json});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({ groupsDeleted }) => {
            queryClient.invalidateQueries({ queryKey: ["groups", groupsDeleted[0].specialtyId.toString()] });
            queryClient.invalidateQueries({ queryKey: ["groups"] });

            toast.success(`groups deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};