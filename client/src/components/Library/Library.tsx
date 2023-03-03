import React from "react"
import { useAuth } from "../../hooks/useAuth"
import { SearchBar } from "../SearchBar/SearchBar"

import "./Library.css"

export const LibraryComponent = () => {
    const { authenticated } = useAuth()

    const onSubmitSearch = (queryString: string) => {}
    return (
        <div className="library-container">
            <SearchBar onSubmit={onSubmitSearch} />
            <div>Library</div>
            <h3>{`Authenticated: ${authenticated}`}</h3>
        </div>
    )
}
