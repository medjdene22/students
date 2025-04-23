'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { studentTestColumns } from "./student-test-columns"
import { useGetTest } from "../api/use-get-test"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useTeacherAssignmentId } from "@/features/teacher-user/hooks/use-teacher-assignment-id"
import { useTestId } from "../hooks/use-test-id"
import { Button } from "@/components/ui/button"
import { useTestEditModel } from "../hooks/use-test-edit-model"
import { Separator } from "@/components/ui/separator"

export default function StudentTestList() {
  const teacherAssignmentId = useTeacherAssignmentId()
  const testId = useTestId()
  
  const { data, isLoading } = useGetTest({ 
    teacherAssignmentId,
    testId
  })
  const { onOpen } = useTestEditModel();

  
  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }
  
  const { test, studentToTest, studentToRemplacement } = data || { test: null, studentToTest: [], studentToRemplacement: [] }

  const onEdit = () => {
    onOpen({
      id: test?.id || 0,
      name: test?.name || "",
      testDate: test?.testDate || "",
      teacherAssignmentId,
      replacementDate: test?.replacementDate || ""
    });
  }
  
  if (!test) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Test not found</CardTitle>
        </CardHeader>
      </Card>
    )
  }
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold line-clamp-1">
            {test.name}
          </CardTitle>
          <div className="mt-1 flex items-center">
            <Badge variant="outline" className="mt-1">
              {format(new Date(test.testDate), 'PPP')}
            </Badge>
            
          </div>
        </div>
        <div>
          <Button onClick={onEdit}>
            Edit test
          </Button>
        </div>
      </CardHeader>
      <CardContent>
      <span className="m-1 text-gray-500">manage student {test.name} status</span>

        <DataTable 
          columns={studentTestColumns} 
          data={studentToTest || []} 
          filterKeys={["name"]} 
        />
      </CardContent>

      
       { !!test.replacementDate && (
      <div>
        <Separator className="-my-4" />

        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold line-clamp-1">
              Replacement 
            </CardTitle>
            <div className="mt-1 flex items-center">
              <Badge variant="outline" className="mt-1">
                {format(new Date(test.replacementDate), 'PPP')}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>          
        <span className="m-1 text-gray-500">which student qualifies for {test.name} replacement</span>

          <DataTable 
            columns={studentTestColumns} 
            data={studentToRemplacement || []} 
            filterKeys={["name"]} 
          />
        </CardContent>
      
      </div>
       )}
      
      
  </Card>
  )
  
}