import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSpecialtiesBySubject = ({id}: {id: string}) => {
    const query = useQuery({
        queryKey: ["subjectSpecialties", id],
        queryFn: async () => {
            const response = await client.api.subject[':id']["specialties"]['$get']({param: {id}});
            if (!response.ok) {
                throw new Error("failed to fetch groups by subject");
            }
            const {specialtySubjects} = await response.json(); 
            return specialtySubjects;
        }
    });
    return query;
}