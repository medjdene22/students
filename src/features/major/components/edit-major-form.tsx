'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { createMajorSchema } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEditMajor } from "../api/use-edit-major";

interface Props {
    initialMajor: {id: number, name: string};
    onCancel?: () => void;
}

export function EditMajorForm({ initialMajor, onCancel }: Props) {

    const form = useForm<z.infer<typeof createMajorSchema>>({
        defaultValues: {
            name: initialMajor.name,
        },
        resolver: zodResolver(createMajorSchema),
    });

    const { mutate, isPending} = useEditMajor();

    // const router = useRouter();

    const onSubmit = (data: z.infer<typeof createMajorSchema>) => {

        mutate({json: data, param: {id: initialMajor.id.toString()}},{

            onSuccess: ({majorUpdated}) => {
                console.log(majorUpdated)
                form.reset();
                onCancel?.();
                // router.push(`/dashboard/majors/${data.id}`)
            },
            
        });
    }


    return (
        <Card className="w-full h-full md:w-[487px] shadow-none border-none"> 
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Edit major</CardTitle>
            </CardHeader>

            <CardContent className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Major name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter major name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                        </div>
                        <Dotted className="py-4"/>
                        <div className="flex items-center w-full justify-between"> 
                            <Button type="button" disabled={isPending} variant="secondary" size={"lg"} onClick={onCancel} className={cn(!onCancel && 'invisible')}>Cancel</Button>   
                            <Button disabled={isPending} type="submit" size={"lg"} >Updtate Major</Button>
                        </div>
                        
                    </form> 
                </Form>    
            </CardContent>
        </Card> 
    )

}    