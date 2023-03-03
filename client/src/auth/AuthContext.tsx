import { createContext, useState, ReactNode } from "react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"

import { User } from "../types/User"
import { auth } from "../firebase/firebase"

type AuthContextT = {
    authenticated: boolean
    user: User | undefined
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
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential?.accessToken
                const user = result.user

                if (token !== undefined && user !== undefined) {
                    setAccessToken(token)
                    setUser(user)
                } else {
                    throw Error("Unknown error")
                }
            })
            .catch((error) => {
                console.error(`Login failed with error: ${error}`)
            })
    }

    return (
        // TODO: Implement useMemo() hook?
        <AuthContext.Provider
            value={{
                authenticated: user !== undefined,
                user,
                onLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }
export type { AuthContextT }
