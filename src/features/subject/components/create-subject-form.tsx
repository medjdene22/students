'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubjectSchema } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateSubject } from "../api/use-create-subject";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
    onCancel?: () => void;
}

export function CreateSubjectForm({ onCancel }: Props) {

    const form = useForm<z.infer<typeof createSubjectSchema>>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(createSubjectSchema),
    });

    const { mutate, isPending} = useCreateSubject();
    const router = useRouter()

    const onSubmit = (data: z.infer<typeof createSubjectSchema>) => {
        mutate({json: data},{
            onSuccess: ({data}) => {
                router.push(`/dashboard/subjects/${data.id}`)
                // form.reset();
                // onCancel?.();
            },
        });
    }

    return (
        <Card className="w-full h-full md:w-[487px] shadow-none border-none"> 
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create a new subject</CardTitle>
            </CardHeader>

            <CardContent className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Subject name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter subject name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                        </div>
                        <Dotted className="py-4"/>
                        <div className="flex items-center w-full justify-between"> 
                            <Button type="button" disabled={isPending} variant="secondary" size={"lg"} onClick={onCancel} className={cn(!onCancel && 'invisible')}>Cancel</Button>   
                            <Button disabled={isPending} type="submit" size={"lg"} >Create Subject</Button>
                        </div>
                        
                    </form> 
                </Form>    
            </CardContent>
        </Card> 
    )
}