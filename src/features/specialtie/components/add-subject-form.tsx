'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAddSubjectToSpecialty } from "../api/use-add-subject-to-specialty"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetSubjects } from "@/features/subject/api/use-get-subjects"
import { useSpecialtieId } from "../hooks/use-specialtie-id"
import { addSubjectSchema } from "../schema"
import { Calendar } from "lucide-react"
import { YEAR } from "@/features/student-group/schema"


interface AddSubjectFormProps {
    onCancel?: () => void;
}

export function AddSubjectForm({ onCancel }: AddSubjectFormProps) {
    const specialtyId = useSpecialtieId()
    const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjects()
    
    const form = useForm<z.infer<typeof addSubjectSchema>>({
        
        resolver: zodResolver(addSubjectSchema),
    })

    const { mutate, isPending } = useAddSubjectToSpecialty()

    const onSubmit = (data: z.infer<typeof addSubjectSchema>) => {
        mutate({
            json: {
                specialtyId: parseInt(specialtyId),
                subjectId: parseInt(data.subjectId),
                year: data.year
            },
            param: { id: specialtyId }
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
                                name="subjectId"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Subject</FormLabel>
                                        <Select
                                            disabled={isPending || isLoadingSubjects}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a subject" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subjects?.map((subject) => (
                                                    <SelectItem key={subject.id} value={subject.id.toString()}>
                                                        {subject.name}
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
                                Add Subject
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}