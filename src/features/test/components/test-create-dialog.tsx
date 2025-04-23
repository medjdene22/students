'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema } from "../schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTest } from "../api/use-create-test";

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

interface TestCreateDialogProps {
  teacherAssignmentId: string;
  isDialogOpen?: boolean;
  setIsDialogOpen?: (open: boolean) => void;
}

export function TestCreateDialog({ 
  teacherAssignmentId, 
  isDialogOpen,
  setIsDialogOpen
}: TestCreateDialogProps) {
  const form = useForm<z.infer<typeof testSchema>>({
    defaultValues: {
      name: "",
      testDate: new Date(),
    },
    resolver: zodResolver(testSchema),
  });

  const { mutate, isPending } = useCreateTest();

  const onSubmit = (data: z.infer<typeof testSchema>) => {
    mutate({
      json: {
        ...data,
        testDate: data.testDate.toISOString().split('T')[0],
        replacementDate: data.replacementDate?.toISOString().split('T')[0],
      },
      param: { teacherAssignmentId }
    }, {
      onSuccess: () => {
        form.reset();
        setIsDialogOpen?.(false);
      },
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex p-6">
        <CardTitle className="text-xl font-bold">Create a new test</CardTitle>
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
                    <Popover>
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
                    <Popover>
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
                onClick={() => setIsDialogOpen?.(false)} 
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>   
              <Button 
                disabled={isPending} 
                type="submit" 
                size={"lg"}
                className="w-full sm:w-auto"
              >
                Create Test
              </Button>
            </div>
          </form> 
        </Form>    
      </CardContent>
    </Card>
  )
}
