import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetMajor = ({id}: {id: string}) => {

    const query = useQuery({
        queryKey: ["major", id],
        queryFn: async () => {

            const response = await client.api.major[":id"]['$get']({param: {id}});
            if (!response.ok) {
                throw new Error("faild to fetch majors");
             }
            const {majorSelected} = await response.json(); 
            return majorSelected;
        }
    })
    return query;
}