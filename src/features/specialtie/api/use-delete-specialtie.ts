import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.specialtie[':id']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.specialtie[':id']['$delete']>

export const useDeleteSpecialtie = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.specialtie[':id']['$delete']({param});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({ specialtieDeleted}) => {
            queryClient.invalidateQueries({ queryKey: ["specialties", specialtieDeleted.majorId.toString()] });
            queryClient.invalidateQueries({ queryKey: ["specialties"] });
            queryClient.invalidateQueries({ queryKey: ["specialty", specialtieDeleted.id.toString()] });
            toast.success(`Specialtie ${specialtieDeleted.name} deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};