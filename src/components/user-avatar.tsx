import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Role } from "@/lib/types";
import { Database, GraduationCap, LucideIcon, User, UserCog } from "lucide-react";

const avatarSizes = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        default: "h-8 w-8",
        sm: "h-7 w-7",
        lg: "h-10 w-10",
        xl: "h-14 w-14"
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const iconSizes = cva("", {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-3.5 w-3.5",
        lg: "h-5 w-5",
        xl: "h-7 w-7"
      },
    },
    defaultVariants: {
      size: "default",
    },
  });

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  user: {
    name?: string | null;
    image?: string | null;
    role?: string | null;
  }
}

const roleIcons: Record<Role, LucideIcon> = {
    [Role.ADMIN]: Database,
    [Role.USER]: User,
    [Role.STUDENT]: GraduationCap,
    [Role.TEACHER]: UserCog,
}

export function UserAvatar({
  user,
  size
}: UserAvatarProps) {

    const RoleIcon = user.role && roleIcons[user.role as Role] || User;
  return (
    <Avatar className={cn(
      avatarSizes({ size })
    )}>
      <AvatarImage src={user.image || ""} alt="Picture" />
      <AvatarFallback className="bg-sky-500 text-white">
        {user.name ?  getInitials(user.name) : <RoleIcon className={iconSizes({size})} />} 
      </AvatarFallback>
    </Avatar>
  );
}

function getInitials(name: string) {
  const [firstName, lastName] = name.split(" ");
  if (lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }
  return firstName.charAt(0);
}