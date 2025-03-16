import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetGroups = () => { 

    const query = useQuery({
        queryKey: ["groups"],
        queryFn: async () => {

            const response = await client.api.group.$get();
            if (!response.ok) {
                throw new Error("faild to fetch groups");
             }
            const {groups} = await response.json(); 
            return groups;
        }
    })
    return query;
}