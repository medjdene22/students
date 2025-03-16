'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { editTeacherSchema } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditTeacher } from "../api/use-edit-teacher";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
    initialValues: {id: string, name: string, email: string, username: string, grade: string};
    onCancel?: () => void;
}

export function EditTeacherForm({ initialValues, onCancel }: Props) {
    const form = useForm<z.infer<typeof editTeacherSchema>>({
        defaultValues: {
            name: initialValues.name,
            email: initialValues.email,
            username: initialValues.username,
            grade: initialValues.grade as "mcb" | "mca" | "professor" | "substitute",
            changePassword: false,
            password: "",
        },
        resolver: zodResolver(editTeacherSchema),
    });

    const { mutate, isPending } = useEditTeacher();

    const watchChangePassword = form.watch("changePassword");

    const onSubmit = (data: z.infer<typeof editTeacherSchema>) => {
        const finalData = {
            ...data,
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
                <CardTitle className="text-xl font-bold">Edit Teacher</CardTitle>
            </CardHeader>

            <CardContent className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Teacher name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter teacher name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="email" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="email" placeholder="Enter teacher email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="username" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter teacher username" {...field} />
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

                            <FormField control={form.control} name="grade" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Grade</FormLabel>
                                    <Select 
                                        disabled={isPending} 
                                        value={field.value} 
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Grade" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            <SelectItem value="mcb">MCB</SelectItem>
                                            <SelectItem value="mca">MCA</SelectItem>
                                            <SelectItem value="professor">Professor</SelectItem>
                                            <SelectItem value="substitute">Substitute</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                        </div>
                        <Dotted className="py-4"/>
                        <div className="flex items-center w-full justify-between"> 
                            <Button type="button" disabled={isPending} variant="secondary" size={"lg"} onClick={onCancel} className={cn(!onCancel && 'invisible')}>Cancel</Button>   
                            <Button disabled={isPending} type="submit" size={"lg"}>Update Teacher</Button>
                        </div>
                    </form> 
                </Form>    
            </CardContent>
        </Card> 
    );
}