import { User } from "types/User"
import { useAuth } from "./useAuth"

type useUserDataT = {
    user: User
    kindleEmail: string | undefined
    updateKindleEmail: (newKindleEmail: string) => Promise<void>
}

/**
 * Hook to get user data. Assumes the user has already been authenticated.
 */
const useUserData = (): useUserDataT => {
    const { user, token } = useAuth()

    const updateKindleEmail = async (newKindleEmail: string) => {
        // TODO
    }

    return {
        user: user!,
        // kindleEmail: "the420kindle@kindle.com",
        kindleEmail: "devinleamy@gmail.com",
        updateKindleEmail,
    }
}

export { useUserData }
