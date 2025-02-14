import { useMedia } from 'react-use'

import {
    Dialog,
    DialogContent,
} from '@/components/ui//dialog'
import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer"

interface Props {
    children: React.ReactNode
    isOpen: boolean
    onOpencChange: (isOpen: boolean) => void
}

export default function ResponsiveModel({ children, isOpen, onOpencChange }: Props) {
    const isDesktop = useMedia('(min-width: 1024px)', true)
    if (isDesktop) return (
        <Dialog open={isOpen} onOpenChange={onOpencChange} >
            <DialogContent className='w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]'>
                {children}
            </DialogContent>
        </Dialog>
    )

    return ( 
        <Drawer open={isOpen} onOpenChange={onOpencChange}>
            <DrawerContent>
                <div className='flex items-center justify-center overflow-y-auto hide-scrollbar max-h-[85vh]'>
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}