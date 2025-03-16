import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSpecialties = () => { 

    const query = useQuery({
        queryKey: ["specialties"],
        queryFn: async () => {

            const response = await client.api.specialtie.$get();
            if (!response.ok) {
                throw new Error("faild to fetch specialties");
             }
            const {specialties} = await response.json(); 
            return specialties;
        }
    })
    return query;
}