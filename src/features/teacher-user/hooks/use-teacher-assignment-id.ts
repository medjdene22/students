import { useParams } from "next/navigation";

export const useTeacherAssignmentId = () => {
    const { teacherAssignmentId } = useParams();
    return teacherAssignmentId as string;
};