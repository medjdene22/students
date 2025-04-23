import { useParams } from "next/navigation";

export const useAssignmentStudentId = () => {
    const { assignmentStudentId } = useParams();
    return assignmentStudentId as string;
};