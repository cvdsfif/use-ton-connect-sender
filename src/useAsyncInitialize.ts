import { useEffect, useState } from "react"

/**
 * Utility hook for asynchronous objects initialization
 * @param func Asynchronous callback returning an initialized object of any type
 * @param deps Dependencies to indicate what are the objects whose changes triggers the returned object's reinitialization
 * @returns Promise that resolves to the object of type T initialized by `func`
 */
export const useAsyncInitialize = <T>(
    func: () => Promise<T>,
    deps: any[]
) => {
    const [state, setState] = useState<T | undefined>()
    const init = async () => setState(await func())
    useEffect(() => { init() }, deps)
    return state
}