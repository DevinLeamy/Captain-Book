import { createContext, useState, ReactNode } from "react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"

import { User } from "../types/User"
import { auth } from "../firebase/firebase"

type AuthContextT = {
    authenticated: boolean
    user: User | undefined
    token: string | undefined
    onLogin: () => void
}

const authProvider = new GoogleAuthProvider()
const AuthContext = createContext<AuthContextT>({} as AuthContextT)

interface AuthContextProviderProps {
    children: ReactNode
}
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}: AuthContextProviderProps) => {
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
    const [user, setUser] = useState<User | undefined>(undefined)

    const onLogin = () => {
        // TODO: Login with Google.
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
                onLogin,
                token: accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }
export type { AuthContextT }
