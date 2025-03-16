
import CreateTeacherModel from "@/features/teachers/components/create-teacher-model"
import EditTeacherModel from "@/features/teachers/components/edit-teacher-model"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {  

  return (
    <div className="h-full">
              <CreateTeacherModel />
              <EditTeacherModel />
      {children}
    </div>
  )
}