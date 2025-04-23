import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSubjectsBySpecialty = ({id}: {id: string}) => {
    const query = useQuery({
        queryKey: ["specialtySubjects", id],
        queryFn: async () => {
            const response = await client.api.specialtie[':id']["subjects"]['$get']({param: {id}});
            if (!response.ok) {
                throw new Error("failed to fetch subjects by specialty");
            }
            const {subjectSpecialties} = await response.json(); 
            return subjectSpecialties;
        }
    });
    return query;
}