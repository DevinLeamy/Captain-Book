import { useState } from "react"

import { NouvelleAPI } from "../api/api"
import { LibgenBook } from "../types/Book"
import { LibgenSearch } from "../types/LibgenSearch"

type SearchStatus = "idle" | "finished" | "waiting" | "failed"
type useSearchType = {
    searchResults: LibgenBook[]
    searchStatus: SearchStatus
    search: (search: LibgenSearch) => void
}

function useSearch(): useSearchType {
    const [searchResults, setSearchResults] = useState<LibgenBook[]>([])
    const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle")

    const onSearch = async (searchQuery: LibgenSearch) => {
        setSearchStatus("waiting")
        let books = await NouvelleAPI.search(searchQuery)
        if (books === undefined) {
            setSearchStatus("failed")
            setSearchResults([])
            console.log("[MAIN] Failed to search")
            return
        }

        setSearchResults(books)
        setSearchStatus("finished")
    }
    return {
        searchResults,
        search: onSearch,
        searchStatus,
    }
}

export { useSearch }
export type { useSearchType }
