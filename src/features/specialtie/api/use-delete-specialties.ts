import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.specialtie['bulk']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.specialtie['bulk']['$post']>

export const useDeleteSpecities = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.specialtie['bulk']['$post']({json});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({ specialtiesDeleted }) => {
            queryClient.invalidateQueries({ queryKey: ["specialties", specialtiesDeleted[0].majorId.toString()] });
            toast.success(`Specialties deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};