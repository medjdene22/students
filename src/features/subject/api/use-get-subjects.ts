import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSubjects = () => { 

    const query = useQuery({
        queryKey: ["subjects"],
        queryFn: async () => {

            const response = await client.api.subject.$get();
            if (!response.ok) {
                throw new Error("failed to fetch subjects");
             }
            const {subjects} = await response.json(); 
            return subjects;
        }
    })
    return query;
}