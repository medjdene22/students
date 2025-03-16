import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.teacher['bulk']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.teacher['bulk']['$post']>

export const useDeleteTeachers = () => {
    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.teacher['bulk']['$post']({json});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast.success(`Teachers deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};