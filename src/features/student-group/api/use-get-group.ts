import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetGroup = ({id}: {id: string}) => {

    const query = useQuery({
        queryKey: ["group", id],
        queryFn: async () => {

            const response = await client.api.group[":id"].$get({param: {id}});
            if (!response.ok) {
                throw new Error("faild to fetch groups");
             }
            const {group} = await response.json(); 
            return group;
        }
    })
    return query;
}