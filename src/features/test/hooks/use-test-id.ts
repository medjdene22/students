import { useParams } from "next/navigation";

export const useTestId = () => {
    const { testId } = useParams();
    return testId as string;
};