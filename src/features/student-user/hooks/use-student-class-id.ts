import { useParams } from "next/navigation";

export const useStudentSubjectId = () => {
    const { classId } = useParams();
    return classId as string;
};