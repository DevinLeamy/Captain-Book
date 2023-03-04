import { useState, Dispatch, useEffect } from "react"

type usePersistentStateT<T> = [T, Dispatch<T>]

/**
 * useState but the data is persistent.
 */
const usePersistentState = <T>(name: string, initialValue: T): usePersistentStateT<T> => {
    const [data, setData] = useState<T>(initialValue)

    useEffect(() => {
        /**
         * Use the locally stored data, if it's available.
         */
        let data = fetchLocally()
        if (data !== undefined) {
            setData(data)
        }
    }, [])

    /**
     * Store a data locally.
     */
    const storeLocally = (data: T) => {
        localStorage.setItem(name, JSON.stringify(data))
    }

    /**
     * Attempt to fetch locally stored data.
     */
    const fetchLocally = (): T | undefined => {
        let json = localStorage.getItem(name)
        if (json === null) {
            return undefined
        }
        setData(JSON.parse(json) as T)
    }

    /**
     * Update the data.
     */
    const onSetData = (newData: T) => {
        storeLocally(newData)
        setData(newData)
    }

    return [data, onSetData]
}

export { usePersistentState }
