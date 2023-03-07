import { useState } from "react"

type RequestStatus = "waiting" | "done" | "idle"

type useAsyncActionT = [() => Promise<void>, RequestStatus]

const useAsyncAction = (action: () => Promise<void>): useAsyncActionT => {
    const [status, setStatus] = useState<RequestStatus>("idle")

    const onAction = async () => {
        setStatus("waiting")
        await action()
        setStatus("done")
    }

    return [onAction, status]
}

export { useAsyncAction }
