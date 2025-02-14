import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetMajors = () => { 

    const query = useQuery({
        queryKey: ["majors"],
        queryFn: async () => {

            const response = await client.api.major.$get();
            if (!response.ok) {
                throw new Error("faild to fetch majors");
             }
            const {majors} = await response.json(); 
            return majors;
        }
    })
    return query;
}