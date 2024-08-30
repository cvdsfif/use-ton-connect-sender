import { useEffect, useState } from "react"

export const useAsyncInitialize = <T>(
    func: () => Promise<T>,
    deps: any[]
) => {
    const [state, setState] = useState<T | undefined>()
    const init = async () => {
        const value = await func()
        setState(value)
    }
    useEffect(() => { init() }, deps)
    return state
}