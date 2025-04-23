import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
    name: string;
    classname?: string;
}

export default function SubjectAvatar(
    { name, classname }: Props
) {
    return (
        <Avatar className={cn("size-8 rounded-md", classname)}>
            <AvatarFallback className="text-white bg-green-600 font-semibold text-lg uppercase rounded-md">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    );
}