import CreateMajorModel from "@/features/major/components/create-major-model"
import EditMajorModel from "@/features/major/components/edit-major-model"
import CreateSpecialtieModel from "@/features/specialtie/components/create-specialtie-model"
import { EditSpecialtie } from "@/features/specialtie/components/edit-specialtie"
import EditSpecialtieModel from "@/features/specialtie/components/edit-specialtie-model"
import CreateGroupModel from "@/features/student-group/components/create-group-model"
import EditGroupModel from "@/features/student-group/components/edit-group-model"
import CreateStudentModel from "@/features/students/components/create-student-model"
import EditStudentModel from "@/features/students/components/edit-student-model"
import { Edit } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {  

  return (
    <div className="h-full">
      <CreateMajorModel />
      <EditMajorModel />
      <CreateSpecialtieModel />
      <EditSpecialtieModel />
      <CreateGroupModel />
      <EditGroupModel />
      <CreateStudentModel />
      <EditStudentModel />

      {children}
    </div>
  )
}