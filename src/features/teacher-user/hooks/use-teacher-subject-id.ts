import { useParams } from "next/navigation";

export const useTeacherSubjectId = () => {
    const { subjectId } = useParams();
    return subjectId as string;
};