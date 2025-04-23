
import { SpecialtieSwitcher } from "@/features/specialtie/components/specialtie-switcher";
import { MajorSwitcher } from "@/features/major/components/major-switcher";
import { GroupSwitcher } from '@/features/student-group/components/group-switcher';
import { EditGroup } from '@/features/student-group/components/edit-group';
import StudentsList from '@/features/students/components/students-list';
import TeacherAssignList from '@/features/teacher-assignment/components/teacher-assignment-list';
import { adminOnly } from "@/lib/admin-only";

export default async function Page() {

      await adminOnly() 
                  
    
  return (
    <div className="flex flex-col gap-y-4">
    
          <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
            
            <div className="flex gap-x-4 w-full">
              <MajorSwitcher />
              <SpecialtieSwitcher />
              <GroupSwitcher/>
            </div>
            
            <EditGroup />
          </div>
          <TeacherAssignList />
          <StudentsList />
        </div>
  )
}
