import { useParams } from "next/navigation";

export const useSubjectId = () => {
    const { subjectId } = useParams();
    return subjectId as string;
};