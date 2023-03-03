import React, { ReactNode } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useLibrary } from "../../hooks/useLibrary"
import { SearchBar } from "../SearchBar/SearchBar"

import "./Library.css"

type LibraryComponentProps = {
    unauthenticated: ReactNode
}

export const LibraryComponent: React.FC<LibraryComponentProps> = ({ unauthenticated }) => {
    const { authenticated } = useAuth()
    const { test } = useLibrary()

    const onSubmitSearch = (queryString: string) => {}
    return (
        <div className="library-container">
            {!authenticated && unauthenticated}
            {authenticated && (
                <div>
                    <SearchBar onSubmit={onSubmitSearch} />
                    <div>Library</div>
                    <button onClick={test}>Test</button>
                </div>
            )}
        </div>
    )
}
