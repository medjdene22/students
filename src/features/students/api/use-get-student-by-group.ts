import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetStudentsByGroup = ({groupId}: {groupId: string}) => {

    
    const query = useQuery({
        queryKey: ["students", groupId],
        queryFn: async () => {
            const response = await client.api.student['group'][':id'].$get({param: {id: groupId}});
            if (!response.ok) {
                throw new Error("faild to fetch students");
            }
            const {students} = await response.json(); 
            return students;
        }
    })
    return query;
}