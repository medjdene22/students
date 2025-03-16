import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.teacher[':id']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.teacher[':id']['$delete']>

export const useDeleteTeacher = () => { 
    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.teacher[':id']['$delete']({param});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast.success(`Teacher deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};