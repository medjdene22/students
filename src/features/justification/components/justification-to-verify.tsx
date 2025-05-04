'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { JustificationStatus, Role } from "@/lib/types"
import { useGetJustificationsToVerify } from "../api/use-get-justifications-to-verify"
import { DataTable } from "@/components/data-table"
import { justificationToVerifyColumns } from "./justification-to-verify-columns"

export const JustificationToVerify = ({role}:{role: Role})=>{


    return (
        <Card>
            <CardHeader className="">
                <CardTitle className="text-2xl font-semibold line-clamp-1">Justification To Verify</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Here you can see all justifications and verify them</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                        <JustificationToVerifyList status={JustificationStatus.PENDING} role={role}/>
                    </TabsContent>
                    <TabsContent value="approved">
                        <JustificationToVerifyList status={JustificationStatus.APPROVED}  role={role}/>
                    </TabsContent>
                    <TabsContent value="rejected">
                        <JustificationToVerifyList status={JustificationStatus.REJECTED}  role={role}/>
                    </TabsContent>
                </Tabs>
                
            </CardContent>
            
        
        </Card>
    )

}

const JustificationToVerifyList = ({status, role}:{status:JustificationStatus, role: Role})=>{
    console.log(role)

    const {data, isLoading} = useGetJustificationsToVerify({status, role})
    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {data && <DataTable columns={justificationToVerifyColumns} data={data.justifications || []} filterKeys={["studentName"]}/>}
        </div>
    )
}    