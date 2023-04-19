import { User } from "types/User"
import { useAuth } from "./useAuth"
import { useEffect, useState } from "react"
import { NouvelleAPI } from "api/api"

type useUserDataT = {
    user: User
    kindleEmail: string | undefined
    updateKindleEmail: (newKindleEmail: string) => Promise<void>
}

/**
 * Hook to get user data. Assumes the user has already been authenticated.
 *
 * TODO: This should be inside a context.
 */
const useUserData = (): useUserDataT => {
    const { user, token } = useAuth()
    const [kindleEmail, setKindleEmail] = useState<string | undefined>(undefined)

    useEffect(() => {
        NouvelleAPI.getKindleEmail(token ?? "").then((email) => {
            setKindleEmail(email)
        })
    }, [token])

    const updateKindleEmail = async (newKindleEmail: string) => {
        let success = await NouvelleAPI.updateKindleEmail(newKindleEmail, token ?? "")
        if (success) {
            setKindleEmail(newKindleEmail)
        } else {
            alert("Failed to update kindle email")
        }
    }

    return {
        user: user!,
        // kindleEmail: "the420kindle@kindle.com",
        // kindleEmail: "devinleamy@gmail.com",
        kindleEmail,
        updateKindleEmail,
    }
}

export { useUserData }
