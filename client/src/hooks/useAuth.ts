import { useContext } from "react"
import { AuthContext, AuthContextT } from "../auth/AuthContext"

type useAuthT = AuthContextT

const useAuth = (): useAuthT => {
    const authContext = useContext(AuthContext)
    return authContext
}

export { useAuth }
