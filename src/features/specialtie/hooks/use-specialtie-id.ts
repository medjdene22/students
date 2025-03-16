import { useParams } from "next/navigation";

export const useSpecialtieId = () => {
    const { specialtieId } = useParams();
    return specialtieId as string;
};