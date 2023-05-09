import { createContext, ReactNode, useEffect, useState } from "react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"

import { User } from "types/User"
import { auth } from "./firebase/firebase"

function getPermittedUsers(): string[] {
    return process.env["REACT_APP_PERMITTED_USERS"]!.split(" ")
}
const PERMITTED_USERS = getPermittedUsers()

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
    const [accessToken, setAccessToken] = useState<string>()
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const authToken = await authUser.getIdTokenResult()
                if (PERMITTED_USERS.find((email) => email === authUser.email) === undefined) {
                    alert(
                        "You have not been granted permission to create an account.\n\nEmail devinleamy@gmail.com if you want one."
                    )
                }
                setUser(authUser)
                setAccessToken(authToken.token)
            } else {
                setUser(undefined)
                setAccessToken(undefined)
            }
        })

        return () => unsubscribe()
    }, [])

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
