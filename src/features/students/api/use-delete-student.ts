import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.student[':id']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.student[':id']['$delete']>

export const useDeleteStudent = () => { 

    const queryClient = useQueryClient()

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.student[':id']['$delete']({param});
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        onSuccess: ({ studentDeleted}) => {
            queryClient.invalidateQueries({ queryKey: ["students", studentDeleted.groupId?.toString()] });

            queryClient.invalidateQueries({ queryKey: ["students"] });
            // queryClient.invalidateQueries({ queryKey: ["students", studentDeleted.id.toString()] });
            toast.success(`student deleted`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};