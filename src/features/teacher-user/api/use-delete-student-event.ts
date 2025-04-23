import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.teacherUser["student-event"][":id"]["$delete"], 200 >;
type RequestType = InferRequestType<typeof client.api.teacherUser["student-event"][":id"]["$delete"] >;

export const useDeleteStudentEvent = ({ teacherSubjectId }: { teacherSubjectId: string }) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.teacherUser["student-event"][":id"].$delete({ param });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: ({deletedEvent}) => {

      toast.success(`Event deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["student-events", deletedEvent.studentId, teacherSubjectId ]});
      queryClient.invalidateQueries({ queryKey: ["student-events", deletedEvent.teacherAssignmentId, deletedEvent.eventDate]});
      queryClient.invalidateQueries({ queryKey: ["students", teacherSubjectId]});
      queryClient.invalidateQueries({ queryKey: ["tests", deletedEvent.teacherAssignmentId.toString()]});

    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
