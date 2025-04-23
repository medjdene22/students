import StudentTestList from "@/features/test/components/student-test-list"
import TestEditModel from "@/features/test/components/test-edit-model"

export default function TestDetailsPage() {
  return (
    <div className="p-6 space-y-4">
      <TestEditModel />
      <StudentTestList />
    </div>
  )
}