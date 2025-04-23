'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCreateSubjectSpecaltie } from "../api/use-add-subject-specialty"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSubjectId } from "../hooks/use-subject-id"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetSpecialties } from "@/features/specialtie/api/use-get-specialties"
import { addSpecialtySchema } from "../schema"
import { YEAR } from "@/features/student-group/schema"
import { Calendar } from "lucide-react"

interface AddSpecialtyFormProps {
    onCancel?: () => void;
}

export function AddSpecialtyForm({ onCancel }: AddSpecialtyFormProps) {
    const subjectId = useSubjectId()
    const { data: specialties, isLoading: isLoadingSpecialties } = useGetSpecialties()
    
    const form = useForm<z.infer<typeof addSpecialtySchema>>({
        // defaultValues: {
        //     year: undefined
        // },
        resolver: zodResolver(addSpecialtySchema),
    })

    const { mutate, isPending } = useCreateSubjectSpecaltie()

    const onSubmit = (data: z.infer<typeof addSpecialtySchema>) => {
        console.log(data)
        mutate({
            json: {
                subjectId: parseInt(subjectId),
                specialtyId: parseInt(data.specialtyId),
                year: data.year
            },
            param: { id: subjectId }
        }, {
            onSuccess: () => {
                form.reset()
                onCancel?.()
            }
        })
    }

    return (
        <Card className="shadow-sm">
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <FormField
                                control={form.control}
                                name="specialtyId"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Specialty</FormLabel>
                                        <Select
                                            disabled={isPending || isLoadingSpecialties}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a specialty" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {specialties?.map((specialty) => (
                                                    <SelectItem key={specialty.id} value={specialty.id.toString()}>
                                                        {specialty.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem className="md:w-1/3">
                                        <FormLabel>Year</FormLabel>
                                        <Select disabled={isPending} defaultValue={field.value} onValueChange={field.onChange}>

                                            <FormControl>
                                                <SelectTrigger>
                                                    <div className="flex items-center gap-x-1">
                                                        <Calendar className="h-4 w-4 mr-3"/>
                                                        <SelectValue placeholder="Select year" />
                                                    </div>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                    <SelectItem value={"first"}>first</SelectItem>
                                                    <SelectItem value={YEAR.second}>second</SelectItem>
                                                    <SelectItem value={YEAR.third}>third</SelectItem>
                                                    <SelectItem value={YEAR.fourth}>fourth</SelectItem>
                                                    <SelectItem value={YEAR.fifth}>fifth</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                Add to Specialty
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}