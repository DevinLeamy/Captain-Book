import { createContext, ReactNode } from "react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"

import { User } from "types/User"
import { auth } from "firebase/firebase"
import { usePersistentState } from "hooks/usePersistentState"

type AuthContextT = {
    authenticated: boolean
    user: User | undefined
    token: string | undefined
    onLogin: () => void
    onLogout: () => void
}

const authProvider = new GoogleAuthProvider()
const AuthContext = createContext<AuthContextT>({} as AuthContextT)

interface AuthContextProviderProps {
    children: ReactNode
}
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}: AuthContextProviderProps) => {
    const [accessToken, setAccessToken] = usePersistentState<string | undefined>("token", undefined)
    const [user, setUser] = usePersistentState<User | undefined>("user", undefined)

    const onLogin = () => {
        signInWithPopup(auth, authProvider)
            .then(async (result) => {
                const user = result.user
                const token = await fetchAccessToken(user)
                if (user !== undefined && token !== undefined) {
                    setUser(user)
                    setAccessToken(token)
                } else {
                    throw Error("Unknown error")
                }
            })
            .catch((error) => {
                console.error(`Login failed with error: ${error}`)
            })
    }

    const onLogout = () => {
        setAccessToken(undefined)
        setUser(undefined)
    }

    /**
     * Fetch the JWT verification access token, that can be used for authorization on
     * the backend.
     */
    const fetchAccessToken = async (user: User): Promise<string> => {
        return await user.getIdToken(true)
    }

    return (
        // TODO: Implement useMemo() hook?
        <AuthContext.Provider
            value={{
                authenticated: user !== undefined,
                user,
                token: accessToken,
                onLogin,
                onLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }
export type { AuthContextT }
