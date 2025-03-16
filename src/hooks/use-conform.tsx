import { useState } from "react";
import { Button , ButtonProps } from "@/components/ui/button";

import {
    Card,
    CardFooter,
    CardTitle,
    CardHeader,
    CardDescription,
    
} from "@/components/ui/card";
import ResponsiveModel from "@/components/responsive-model";
import React from "react";


export const useConfirm = (
    title: string,
    message: string,
    variant: ButtonProps["variant"] = "default"
) : [() => React.JSX.Element, () => Promise<unknown>] => {

    const [promise, setPromise] = useState< { resolve: (value : boolean) => void } | null>(null)
    const confirm = () => new Promise((resolve ) => {
        setPromise({resolve});
    });

    const handClose = () => {
        setPromise(null);
    };

    const handelConfirm = ()  => {
        promise?.resolve(true);
        handClose()
    }
    const handelCancel = ()  => {
        promise?.resolve(false);
        handClose()
    }
    const ConfiramtionDialog = ()  => (
        <ResponsiveModel isOpen={promise !==null} onOpencChange={handClose}>

            <Card className="w-full h-full md:w-[487px] shadow-none border-none">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-4 items-center justify-end">
                        <Button className="w-full lg:w-auto" variant="outline" onClick={handelCancel}>Cancel</Button>
                        <Button type="button" className="w-full lg:w-auto" variant={variant} onClick={handelConfirm}>Confirm</Button>
                    </CardFooter>
            </Card> 

        </ResponsiveModel>
    )
    return [ConfiramtionDialog, confirm ]
};
