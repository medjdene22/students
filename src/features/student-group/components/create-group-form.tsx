'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchima, SECTION, YEAR } from "../schema";
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
import { useCreateGroup } from "../api/use-create-group";
import SpecialtyAvatar from "@/features/specialtie/components/specialty-avatar";

import { Users, Calendar } from "lucide-react";

interface Props {
    majorId: number;
    specialtyId: string;
    specialtyOptions: {id: string, name: string}[];

    onCancel?: () => void;
}

export function CreateGroupForm({  specialtyId, specialtyOptions, onCancel }: Props) {

    const form = useForm<z.infer<typeof createGroupSchima>>({
        defaultValues: {
            specialtyId: specialtyId || specialtyOptions[0].id,

        },
        resolver: zodResolver(createGroupSchima),
    });

    const { mutate, isPending} = useCreateGroup();

    // const router = useRouter();

    const onSubmit = (data: z.infer<typeof createGroupSchima>) => {
        const finalData = {
            ...data,
            specialtyId: Number(data.specialtyId),
        }
        mutate({json: finalData},{
            onSuccess: ({groupCreated}) => {
                console.log(groupCreated)
                form.reset();
                onCancel?.()
                // router.push(`/dashboard/majors/${groupCreated.majorId}/specialties/${groupCreated.specialtyId}/groups/${groupCreated.id}`)
            },
            
        });
    }


    return (
        <Card className="w-full h-full md:w-[487px] shadow-none border-none"> 
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create a new group</CardTitle>
            </CardHeader>

            <CardContent className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Group name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="text" placeholder="Enter major name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="specialtyId" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Specialty</FormLabel>

                                    <Select disabled={isPending} defaultValue={field.value.toString()} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select specialty" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            {specialtyOptions.map((specialty) => (
                                                <SelectItem key={specialty.id} value={specialty.id.toString()}>
                                                    <div className="flex items-center gap-x-2">
                                                        <SpecialtyAvatar name={specialty.name} classname="size-6" />
                                                        {specialty.name}
                                                    </div>
                                                    
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>

                            

                            <FormField control={form.control} name="section" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Section</FormLabel>
                                    <Select disabled={isPending} defaultValue={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <div className="flex items-center gap-x-1">
                                                    <Users className="h-4 w-4 mr-3"/>
                                                    <SelectValue placeholder="Select section" />
                                                </div>
                                                
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            <SelectItem value={SECTION.section1}>section 1</SelectItem>
                                            <SelectItem value={SECTION.section2}>section 2</SelectItem>
                                            <SelectItem value={SECTION.section3}>section 3</SelectItem>
                                            <SelectItem value={SECTION.section4}>section 4</SelectItem> 
                                            <SelectItem value={SECTION.section5}>section 5</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="year" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <Select disabled={isPending} defaultValue={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <div className="flex items-center gap-x-1">
                                                    <Calendar className="h-4 w-4 mr-3"/>
                                                    <SelectValue placeholder="Select year" />
                                                </div>
                                                
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            <SelectItem value={YEAR.first}>first</SelectItem>
                                            <SelectItem value={YEAR.second}>second</SelectItem>
                                            <SelectItem value={YEAR.third}>third</SelectItem>
                                            <SelectItem value={YEAR.fourth}>fourth</SelectItem>
                                            <SelectItem value={YEAR.fifth}>fifth</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>

                        </div>
                        <Dotted className="py-4"/>
                        <div className="flex items-center w-full justify-between"> 
                            <Button type="button" disabled={isPending} variant="secondary" size={"lg"} onClick={onCancel} className={cn(!onCancel && 'invisible')}>Cancel</Button>   
                            <Button disabled={isPending} type="submit" size={"lg"} >Create Specialtie</Button>
                        </div>
                        
                    </form> 
                </Form>    
            </CardContent>
        </Card> 
    )

}    