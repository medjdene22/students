'use client'

import { authClient } from "@/lib/auth-client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "./ui/sidebar"
import { UserButton } from "@/features/auth/component/user-button"
import { Role } from "@/lib/types"
import { usePathname } from "next/navigation"

export default function Header() {
  const { data } = authClient.useSession();
  const role = data?.user.role;
  const pathSegments = usePathname().split('/').slice(2);

  // Create a mapping of path patterns to page titles and descriptions
  const pageConfig = {
    default: {
      title: "Home",
      description: "Monitor all of your teachers and students"
    },
    majors: {
      title: "Majors",
      description: "Manage your majors"
    },
    "majors/[id]": {
      title: "Edit Major",
      description: "Edit major specialties"
    },
    "majors/[id]/specialties": {
      title: "Specialties",
      description: "View specialties"
    },
    "majors/[id]/specialties/[specId]": {
      title: "Edit Specialty",
      description: "Edit specialty groups and subjects"
    },
    "majors/[id]/specialties/[specId]/groups": {
      title: "Groups",
      description: "View groups"
    },
    "majors/[id]/specialties/[specId]/groups/[groupId]": {
      title: "Edit Group",
      description: "Edit group students and teachers"
    },
    // New routes
    "teachers": {
      title: "Teachers",
      description: "Manage teaching staff"
    },
    "subjects": {
      title: "Subjects",
      description: "Manage curriculum subjects"
    },
    "subjects/[id]": {
      title: "Edit Subject",
      description: "Modify subject details and assignments"
    }
  };

  // Determine the current path pattern
  const getPathPattern = () => {
    const base = pathSegments[0];

    if (!base) return "default";

    // Handle majors routes
    if (base === "majors") {
      if (pathSegments.length === 1) return "majors";

      if (!isNaN(Number(pathSegments[1]))) {
        if (pathSegments.length === 2) return "majors/[id]";

        if (pathSegments[2] === "specialties") {
          if (pathSegments.length === 3) return "majors/[id]/specialties";

          if (!isNaN(Number(pathSegments[3]))) {
            if (pathSegments.length === 4) return "majors/[id]/specialties/[specId]";

            if (pathSegments[4] === "groups") {
              if (pathSegments.length === 5) return "majors/[id]/specialties/[specId]/groups";

              if (!isNaN(Number(pathSegments[5]))) {
                return "majors/[id]/specialties/[specId]/groups/[groupId]";
              }
            }
          }
        }
      }
    }

    // Handle dashboard routes
    if (base === "teachers") {
      return "teachers";
    }

    if (base === "subjects") {
      if (pathSegments.length === 1) return "subjects";

      if (pathSegments.length === 2 && !isNaN(Number(pathSegments[1]))) {
        return "subjects/[id]";
      }
    }

    return "default";
  };

  const currentPath = getPathPattern();
  const { title, description } = pageConfig[currentPath] || pageConfig.default;

  return (
    <header className="p-3 flex items-center justify-between mr-2 border-b">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-10 hidden lg:flex" />
        {role === Role.ADMIN && (
          <div className="flex-col hidden lg:flex">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}
      </div>

      <UserButton />
    </header>
  );
}
