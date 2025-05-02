'use client'

import { DataTable } from "@/components/data-table"
import { justificationColumns } from "./justification-columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetJustifications } from "../api/use-get-justifications"



export function JustificationList() {

  const { data, isLoading } = useGetJustifications()

  const justification = data?.justifications || []
  if (isLoading) {
    return <div>Loading justification details...</div>
  }

  if (!justification) {
    return <div>No justification data available</div>
  }
  

  return (
    <Card className="p-4">
      <CardHeader className="flex-row items-center justify-between -mt-2">
        <CardTitle className="text-2xl font-semibold line-clamp-1">Justification List</CardTitle>
        
      </CardHeader>
      <CardContent>
        <DataTable columns={justificationColumns} data={justification} filterKeys={["assessment"]}/>
      </CardContent>
      
    
    </Card>
  )
}
