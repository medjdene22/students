'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { editStudentSchema } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditStudent } from "../api/use-edit-student";
import MajorAvatar from "@/features/student-group/components/major-avatar";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
    groupOptions: {id: number, name: string}[];
    initialValues: {id: string, name: string, email: string, username: string, groupId: number | null};
    onCancel?: () => void;
}

export function EditStudentForm({initialValues, groupOptions, onCancel }: Props) {
    const form = useForm<z.infer<typeof editStudentSchema>>({
        defaultValues: {
            name: initialValues.name,
            email: initialValues.email,
            username: initialValues.username,
            groupId: groupOptions.some(option => option.id === initialValues.groupId) 
            ? initialValues.groupId 
            : null,
            changePassword: false,
            password: "",
        },
        resolver: zodResolver(editStudentSchema),
    });

    const { mutate, isPending} = useEditStudent();

    const watchChangePassword = form.watch("changePassword");

    const onSubmit = (data: z.infer<typeof editStudentSchema>) => {
        const finalData = {
            ...data,
            groupId: data.groupId ? Number(data.groupId) : null,
            password: data.changePassword ? data.password : undefined,
        };
        
        mutate({
            json: finalData,
            param: {
                id: initialValues.id,
            }
        }, {
            onSuccess: () => {
                form.reset();
                onCancel?.();
            },
        });
    };

    return (
        <Card className="w-full h-full md:w-[487px] shadow-none border-none"> 
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Edit Student</CardTitle>
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

                            <FormField control={form.control} name="changePassword" render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Change password</FormLabel>
                                    </div>
                                </FormItem>
                            )}/>

                            {watchChangePassword && (
                                <FormField control={form.control} name="password" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isPending} 
                                                type="password" 
                                                placeholder="Enter new password" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            )}

                            <FormField control={form.control} name="groupId" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Group</FormLabel>
                                    <Select 
                                        disabled={isPending} 
                                        value={field.value?.toString() ?? ""} 
                                        onValueChange={field.onChange}
                                    >
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
                            <Button disabled={isPending} type="submit" size={"lg"} >Update Student</Button>
                        </div>
                    </form> 
                </Form>    
            </CardContent>
        </Card> 
    );
}