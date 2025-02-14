import { parseAsBoolean, useQueryState} from 'nuqs'

export const useCreateMajorModel = () => {
    const [isOpen, setIsOpen] = useQueryState(
        'create-major',
        parseAsBoolean.withDefault(false).withOptions({
            clearOnDefault: true 
        })
    )
    const open = () => setIsOpen(true)
    const onClose = () => setIsOpen(false)

    return {
        isOpen,
        open,
        onClose,
        setIsOpen
    }
}

