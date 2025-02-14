"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { emailPattern, LoginSchema } from "@/lib/types";
import {
    Form,
    FormControl,
    FormItem,
    FormField,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Poppins} from "next/font/google"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
  })


export function LoginForm(){

    const router = useRouter()
    
    const [ isPending, startTransition] = useTransition()

    const [error, setError] = useState< string | undefined >("")
    const [success, setSuccess] = useState< string | undefined >("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            id: "",
            password: ""
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
      setError("")
      setSuccess("")

      
      const { id, password } = values
      // is id an email or username
      const isEmail = emailPattern.test(id)
      startTransition(async () => {
        if (isEmail) {
            await authClient.signIn.email({
              email: id,
              password: password,
              fetchOptions: {
                onSuccess: () => {
                  setSuccess("Successfully logged in")
                  router.push("/dashboard")
                },
                onError: ({error}) => {
                  setError(error.message)
                  // form.reset()
                }
              }
            })   
        } else {
            await authClient.signIn.username({
              username: id,
              password: password,
              fetchOptions: {
                onSuccess: () => {
                  setSuccess("Successfully logged in")
                  toast.success("Login successful");
                  router.push("/dashboard")
                },
                onError: ({error}) => {
                  setError(error.message)
                  toast.error(error.message);
                }
              }
            })
        }
      })
        
        
    }

    return(
      <Card className="">
        <CardHeader>
          <div className="w-full flex flex-col gap-y-4 items-center justify-center">
              <Link href={"/"}><h1 className={cn("text-3xl font-semibold", font.className  )}>Student Attendence</h1></Link>
              <p className="text-muted-foreground text-md">Welcome back</p>
          </div>
        </CardHeader>
        <CardContent>   
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                    <FormField control={form.control} name="id" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="moh@exmple.com" type="text" disabled={isPending}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="********" type="password" disabled={isPending}/>
                                </FormControl>
                                <Button size="sm" variant="link" asChild className="px-1">
                                    <Link href="/auth/reset">Forgot password?</Link>
                                </Button>
                                <FormMessage/>
                            </FormItem>
                    )}/>
                    </div>
                    <div className="space-y-2">
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isPending}>Log in</Button>
                </form>
            </Form>
        </CardContent> 
      </Card>
    )

}