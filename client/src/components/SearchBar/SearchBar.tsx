import TextField from "@mui/material/TextField"
import { useState } from "react"

interface SearchBarProps {
    onSubmit: (queryString: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
    const [queryString, setQueryString] = useState<string>("")

    return (
        <div className="w-full">
            <TextField
                fullWidth
                id="search-input"
                size="medium"
                label="Search"
                variant="outlined"
                onChange={(e) => setQueryString(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSubmit(queryString)
                    }
                }}
            />
        </div>
    )
}
