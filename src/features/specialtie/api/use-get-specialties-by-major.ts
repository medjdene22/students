import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSpecialtiesByMajor = ({majorId}: {majorId: string}) => {

    const query = useQuery({
        queryKey: ["specialties", majorId],
        queryFn: async () => {
            const response = await client.api.specialtie['major'][':majorId'].$get({param: {majorId}});
            if (!response.ok) {
                throw new Error("faild to fetch specialties");
            }
            const {specialties} = await response.json(); 
            return specialties;
        }
    })
    return query;
}