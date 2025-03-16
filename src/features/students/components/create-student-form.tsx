'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudentSchima } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { useCreateStudent } from "../api/use-create-student";
import MajorAvatar from "@/features/student-group/components/major-avatar";

interface Props {
    groupId: string;
    groupOptions: {id: string, name: string}[];

    onCancel?: () => void;
}

export function CreateStudentForm({ groupId, groupOptions, onCancel }: Props) {

    console.log(Number(groupId))
    const form = useForm<z.infer<typeof createStudentSchima>>({
        defaultValues: {
            groupId: groupOptions.some(option => option.id === groupId) 
            ? Number(groupId) 
            : null,
        },
        resolver: zodResolver(createStudentSchima),
    });

    const { mutate, isPending} = useCreateStudent();

    // const router = useRouter();

    const onSubmit = (data: z.infer<typeof createStudentSchima>) => {
        const groupId = Number(data.groupId) === 0 ? null : Number(data.groupId)
        const finalData = {
            ...data,
            groupId
        }
        mutate({json: finalData},{
            onSuccess: ({student}) => {
                console.log(student)
                form.reset();
                onCancel?.()
                // router.push(`/dashboard/majors/${groupCreated.majorId}/specialties/${groupCreated.specialtyId}/groups/${groupCreated.id}`)
            },
            
        });
    }


    return (
        <Card className="w-full h-full md:w-[487px] shadow-none border-none"> 
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Add a new group</CardTitle>
            </CardHeader>

            <CardContent className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Student name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter student name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="email" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="email" placeholder="Enter student email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="username" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Matricule</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter student matricule" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            
                            )}/>

                            

                            <FormField control={form.control} name="password" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="password" placeholder="Enter student password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField control={form.control} name="groupId" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Group</FormLabel>
                                    <Select disabled={isPending} defaultValue={field.value?.toString()} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Group" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            {groupOptions.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                    <div className="flex items-center gap-x-2">
                                                        <MajorAvatar name={group.name} classname="size-6" />
                                                        {group.name}
                                                    </div>
                                                    
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                                
                            )}/>

                        </div>
                        <Dotted className="py-4"/>
                        <div className="flex items-center w-full justify-between"> 
                            <Button type="button" disabled={isPending} variant="secondary" size={"lg"} onClick={onCancel} className={cn(!onCancel && 'invisible')}>Cancel</Button>   
                            <Button disabled={isPending} type="submit" size={"lg"} >Add Students

                            </Button>
                        </div>
                        
                    </form> 
                </Form>    
            </CardContent>
        </Card> 
    )

}    