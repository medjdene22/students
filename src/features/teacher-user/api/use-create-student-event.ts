import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType< typeof client.api.teacherUser["student-event"]["$post"],  200 >;
type RequestType = InferRequestType< typeof client.api.teacherUser["student-event"]["$post"] >;

export const useCreateStudentEvent = ({ teacherSubjectId }: { teacherSubjectId: string }) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.teacherUser["student-event"].$post({ json });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      const { event } = data;
      toast.success(`Event recorded successfully`);
      queryClient.invalidateQueries({ queryKey: ["student-events", event.studentId, teacherSubjectId ]});
      queryClient.invalidateQueries({ queryKey: ["student-events", event.teacherAssignmentId, event.eventDate]});
      queryClient.invalidateQueries({ queryKey: ["students", teacherSubjectId]});
      queryClient.invalidateQueries({ queryKey: ["tests", event.teacherAssignmentId.toString()]});
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
