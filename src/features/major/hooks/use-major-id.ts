import { useParams } from "next/navigation";

export const useMajorId = () => {
    const { majorId } = useParams();
    return majorId as string;
};