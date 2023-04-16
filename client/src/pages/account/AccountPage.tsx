import { useState } from "react"

import { Button, TextField } from "@mui/material"
import { useAuth } from "hooks/useAuth"
import { useUserData } from "hooks/useUserData"

const AccountPage = () => {
    const { kindleEmail } = useUserData()
    const { onLogout } = useAuth()
    const [displayedKindleEmail, setDisplayedKindleEmail] = useState<string>(kindleEmail ?? "")
    const updatedEmail = displayedKindleEmail != (kindleEmail ?? "")

    const updateKindleEmail = () => {
        // TODO
    }

    const revertChanges = () => {
        setDisplayedKindleEmail(kindleEmail ?? "")
    }

    return (
        <div className="w-full">
            <div className="text-2xl font-bold mb-8">Account</div>
            <TextField
                label="Send to kindle email"
                value={displayedKindleEmail}
                onChange={(e) => setDisplayedKindleEmail(e.target.value)}
                size="small"
                className="font-bold"
            />
            <div className="mt-8">
                {updatedEmail && (
                    <>
                        <Button variant="contained" onClick={updateKindleEmail}>
                            Update Information
                        </Button>
                        <Button variant="contained" onClick={revertChanges}>
                            Cancel
                        </Button>
                    </>
                )}
            </div>
            <div className="mt-8">
                <Button variant="contained" onClick={onLogout}>
                    Log out
                </Button>
            </div>
        </div>
    )
}

export default AccountPage
