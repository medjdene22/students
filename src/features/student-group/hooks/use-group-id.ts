import { useParams } from "next/navigation";

export const useGetGroupId = () => {
    const { groupId } = useParams();
    return groupId as string;
};