import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.student['bulk']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.student['bulk']['$post']>

export const useDeleteStudents = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.student['bulk']['$post']({json});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({ groups }) => {
            groups.forEach(group => {
                queryClient.invalidateQueries({ queryKey: ["students", group.groupId?.toString()] });
            })
            queryClient.invalidateQueries({ queryKey: ["students"] });

            toast.success(`students deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};