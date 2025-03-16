import { parseAsBoolean, parseAsString, useQueryState} from 'nuqs'
import { string } from 'zod'

export const useEditModel = ({query}: {query: string}) => {
    const [id, setId] = useQueryState(
        query,
        parseAsString
    )
    const open = (id: number | string) => setId(id.toString())
    const onClose = () => setId(null)

    return {
        id,
        open,
        onClose,
        setId
    }
}

