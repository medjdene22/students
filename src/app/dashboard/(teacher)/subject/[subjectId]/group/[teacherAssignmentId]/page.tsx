import StudentList from "@/features/teacher-user/components/student-list";
import TestEditModel from "@/features/test/components/test-edit-model";
import TestList from "@/features/test/components/test-list";


export default function Page() {
    
    return (
        <div className="space-y-4">
            <StudentList />
            <TestList />
            <TestEditModel />
        </div>  
    )
}