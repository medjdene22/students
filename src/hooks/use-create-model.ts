import { parseAsBoolean, useQueryState} from 'nuqs'

export const useCreateModel = ({query}: {query: string}) => {
    const [isOpen, setIsOpen] = useQueryState(
        query,
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

