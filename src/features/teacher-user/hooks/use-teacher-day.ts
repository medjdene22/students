import { useParams } from "next/navigation";

export const useTeacherDay = () => {
    const { day } = useParams();
    return day as string;
};