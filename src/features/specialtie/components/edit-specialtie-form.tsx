'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { createSpecialtieSchema, CYCLE } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpenText } from "lucide-react";
import { useEditSpecialtie } from "../api/use-edit-specialtie";

interface Props {
    onCancel?: () => void;
    initialValues: {id: number, name: string, cycle: string, majorId: number};
}

export function SpecialtieForm({ onCancel, initialValues }: Props) {

    const form = useForm<z.infer<typeof createSpecialtieSchema>>({
        defaultValues: {
            name: initialValues.name,
            cycle: initialValues.cycle as CYCLE,
        },
        resolver: zodResolver(createSpecialtieSchema),
    });

    const { mutate, isPending} = useEditSpecialtie();

    // const router = useRouter();

    const onSubmit = (data: z.infer<typeof createSpecialtieSchema>) => {
        mutate({
            json: data,
            param:{
                id: initialValues.id.toString(),
            }
        },{
            onSuccess: ({specialtieUpdated}) => {
                console.log(specialtieUpdated)
                form.reset();
                // router.push(`/dashboard/majors/${specialtieCreated.majorId}/specialties/${specialtieCreated.id}`)
                onCancel?.();
            },
            
        });
    }


    return (
        <Card className="w-full h-full md:w-[487px] shadow-none border-none"> 
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Edit specialty</CardTitle>
            </CardHeader>

            <CardContent className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Specialtie name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter specialtie name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="cycle" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Cycle</FormLabel>
                                    <Select disabled={isPending} defaultValue={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <div className="flex items-center gap-x-1">
                                                    <BookOpenText className="h-4 w-4 mr-3"/>
                                                    <SelectValue placeholder="Select cycle" />
                                                </div>
                                                
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            <SelectItem value={CYCLE.license}>license</SelectItem>
                                            <SelectItem value={CYCLE.master}>master</SelectItem>
                                            <SelectItem value={CYCLE.engineer}>engineer</SelectItem>
                                            <SelectItem value={CYCLE.PhD}>PhD</SelectItem>

                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>

                        </div>
                        <Dotted className="py-4"/>
                        <div className="flex items-center w-full justify-between"> 
                            <Button type="button" disabled={isPending} variant="secondary" size={"lg"} onClick={onCancel} className={cn(!onCancel && 'invisible')}>Cancel</Button>   
                            <Button disabled={isPending} type="submit" size={"lg"} >Update Specialtie</Button>
                        </div>
                        
                    </form> 
                </Form>    
            </CardContent>
        </Card> 
    )

}    