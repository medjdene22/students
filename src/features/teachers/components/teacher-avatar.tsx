import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Book, BookOpen, UserCog } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export enum Grade {
    MCB = "mcb",
    MCA = "mca",
    Professor = "professor",
    Substitute = "substitute",
}

interface TeacherAvatarProps {
    name?: string;
    grade?: string;
    classname?: string;
}

const avatarVariants = cva(
    "bg-primary/10",
    {
        variants: {
            grade: {
                mcb: "bg-blue-100 text-blue-700",
                mca: "bg-purple-100 text-purple-700",
                professor: "bg-amber-100 text-amber-700",
                substitute: "bg-gray-100 text-gray-700",
            }
        },
        defaultVariants: {
            grade: "mcb"
        }
    }
);

export default function TeacherAvatar({ grade = "mcb", classname }: TeacherAvatarProps) {
    return (
        <Avatar className={cn("border-0", classname, avatarVariants({ grade: grade as "mcb" | "mca" | "professor" | "substitute" }))}>
            <AvatarFallback>
                {getIconByGrade(grade)}
            </AvatarFallback>
        </Avatar>
    );
}

function getIconByGrade(grade: string) {
    switch (grade) {
        case "professor":
            return <BookOpen className="size-4" />;
        case "mca":
            return <Book className="size-4" />;
        case "substitute":
            return <UserCog className="size-4" />;
        default:
            return <UserCog className="size-4" />;
    }
}