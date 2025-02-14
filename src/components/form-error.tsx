import { TriangleAlert } from "lucide-react";

type Props = {
    message?: string;
}

export function FormError({message} :Props) {
    if (!message) return null;

    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <TriangleAlert className="h-4 w-3"/>
            <p>{message}</p>
        </div>
    )
}