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
                            <b>Update Email</b>
                        </Button>
                        <span>{"   "}</span>
                        <Button variant="contained" onClick={revertChanges}>
                            <b>Cancel</b>
                        </Button>
                    </>
                )}
            </div>
            <div className="mt-8">
                <Button variant="contained" onClick={onLogout}>
                    <b>Log out</b>
                </Button>
            </div>
            <br />
            <div>
                <div className="font-bold text-lg mb-2">Notes:</div>
                <ul className="list-disc ml-6">
                    <li className="mb-2">
                        For <i>"Send to Kindle"</i> to work, you need add{" "}
                        <span className="text-blue-400">captainbook.kindle@gmail.com</span> to your
                        kindle's allow list. Steps to do this can be found{" "}
                        <a
                            className="text-blue-400"
                            href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX9XLEVV8G4DB28H"
                            target="_blank"
                        >
                            <u>here</u>
                        </a>
                        .<br />
                    </li>
                    <li>
                        Instructions for finding your{" "}
                        <span className="text-blue-400">kindle email</span> can be found{" "}
                        <a
                            className="text-blue-400"
                            href="https://www.lifewire.com/find-kindle-email-address-5271915"
                            target="_blank"
                        >
                            <u>here</u>
                        </a>
                        .
                    </li>
                    <li>
                        If you want a feature or bug fix, feel free to submit pull requests to the
                        project on{" "}
                        <a
                            className="text-blue-400"
                            href="https://github.com/DevinLeamy/Captain-Book"
                            target="_blank"
                        >
                            <u>Github</u>
                        </a>
                        .
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AccountPage
