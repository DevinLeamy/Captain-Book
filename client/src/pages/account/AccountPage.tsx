import { useEffect, useState } from "react"

import { Button, TextField } from "@mui/material"
import { useAuth } from "hooks/useAuth"
import { useUserData } from "hooks/useUserData"

const AccountPage = () => {
    const { kindleEmail, updateKindleEmail } = useUserData()
    const { onLogout } = useAuth()
    const [displayedKindleEmail, setDisplayedKindleEmail] = useState<string>(kindleEmail ?? "")
    const updatedEmail = displayedKindleEmail != (kindleEmail ?? "")

    useEffect(() => {
        setDisplayedKindleEmail(kindleEmail ?? "")
    }, [kindleEmail])

    const onUpdateKindleEmail = () => {
        updateKindleEmail(displayedKindleEmail)
    }

    const revertChanges = () => {
        setDisplayedKindleEmail(kindleEmail ?? "")
    }

    return (
        <div className="w-full">
            <div className="mt-10">
                <TextField
                    label="Send to kindle email"
                    value={displayedKindleEmail}
                    onChange={(e) => setDisplayedKindleEmail(e.target.value)}
                    size="small"
                    fullWidth
                    className="font-bold"
                />
            </div>
            <div className="mt-8">
                {updatedEmail && (
                    <>
                        <Button variant="contained" onClick={onUpdateKindleEmail}>
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
