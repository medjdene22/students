import CreateSubjectModel from "@/features/subject/components/create-subject-model"
import EditSubjectModel from "@/features/subject/components/edit-subject-model"

export default function SubjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <CreateSubjectModel />
      <EditSubjectModel />
      {children}
    </div>
  )
}
