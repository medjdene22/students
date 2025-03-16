import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetGroupsBySpecialty = ({specialtyId}: {specialtyId: string}) => {

    const query = useQuery({
        queryKey: ["groups", specialtyId],
        queryFn: async () => {
            const response = await client.api.group['specialty'][':specialtyId'].$get({param: {specialtyId}});
            if (!response.ok) {
                throw new Error("faild to fetch groups");
            }
            const {groups} = await response.json(); 
            return groups;
        }
    })
    return query;
}