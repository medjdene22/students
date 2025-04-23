'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateTest } from "../api/use-update-test";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dotted } from "@/components/dotted";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useTestEditModel } from "../hooks/use-test-edit-model";

export function TestEditDialog() {
  const { test, onClose } = useTestEditModel();

  const form = useForm<z.infer<typeof testSchema>>({
    defaultValues: {
      name: test?.name || "",
      testDate: test?.testDate ? new Date(test.testDate) : undefined,
      replacementDate: test?.replacementDate ? new Date(test.testDate) : undefined,
    },
    resolver: zodResolver(testSchema),
  });

  // Update form when test changes
  useEffect(() => {
    if (test) {
      form.reset({
        name: test.name,
        testDate: new Date(test.testDate)
      });
    }
  }, [test, form]);

  const { mutate, isPending } = useUpdateTest();

  // If no test is selected, don't render
  if (!test) return null;

  const onSubmit = (data: z.infer<typeof testSchema>) => {
    mutate({
      json: {
        ...data,
        testDate: data.testDate.toISOString().split('T')[0],
        replacementDate: data.replacementDate?.toISOString().split('T')[0],

      },
      param: { 
        teacherAssignmentId: test.teacherAssignmentId, 
        testId: test.id.toString() 
      }
    }, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Card className="w-full h-full md:w-[487px] shadow-none border-none"> 
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit test</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField 
                control={form.control} 
                name="name" 
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Test name</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isPending} 
                        type="text" 
                        placeholder="Enter test name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Test Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="replacementDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Replacement Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? new Date()}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              

            </div>
            <Dotted className="py-4"/>
            <div className="flex items-center w-full justify-between"> 
              <Button 
                type="button" 
                disabled={isPending} 
                variant="secondary" 
                size={"lg"} 
                onClick={onClose}
              >
                Cancel
              </Button>   
              <Button 
                disabled={isPending} 
                type="submit" 
                size={"lg"} 
              >
                Update Test
              </Button>
            </div>
          </form> 
        </Form>    
      </CardContent>
    </Card>
  )
}
