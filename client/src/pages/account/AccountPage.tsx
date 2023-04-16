import { Button } from "@mui/material"
import { useAuth } from "hooks/useAuth"

const AccountPage = () => {
    const { onLogout } = useAuth()
    return (
        <div className="w-full">
            <div className="text-2xl font-bold">Account</div>
            <Button variant="contained" onClick={onLogout}>
                Log out
            </Button>
        </div>
    )
}

export default AccountPage
