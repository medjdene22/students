import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { z } from "zod"

type ResponseType = InferResponseType<typeof client.api.major[':id']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.major[':id']['$delete']>

export const useDeleteMajor = () => {

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.major[':id']['$delete']({param});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({majorDeleted}) => {
            queryClient.invalidateQueries({ queryKey: ["major", majorDeleted.id] });
            queryClient.invalidateQueries({ queryKey: ["majors"] });
            toast.success(`Major ${majorDeleted.name} deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};