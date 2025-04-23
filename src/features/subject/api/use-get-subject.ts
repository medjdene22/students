import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSubject = ({id}: {id: string}) => {

    const query = useQuery({
        queryKey: ["subject", id],
        queryFn: async () => {

            const response = await client.api.subject[":id"]['$get']({param: {id}});
            if (!response.ok) {
                throw new Error("failed to fetch subject");
             }
            const {subjectSelected} = await response.json(); 
            return subjectSelected;
        }
    })
    return query;
}