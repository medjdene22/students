import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSpecialtie = ({id}: {id: string}) => {

    const query = useQuery({
        queryKey: ["specialtie", id],
        queryFn: async () => {

            const response = await client.api.specialtie[":id"]['$get']({param: {id}});
            if (!response.ok) {
                throw new Error("faild to fetch specialties");
             }
            const {specialtieSelected} = await response.json(); 
            return specialtieSelected;
        }
    })
    return query;
}