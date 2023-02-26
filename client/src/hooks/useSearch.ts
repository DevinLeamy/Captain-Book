import { useState } from "react"

import { NouvelleAPI } from "../api/api"
import { Book } from "../types/Book"
import { LibgenSearch } from "../types/LibgenSearch"

type useSearchType = {
    searchResults: Book[],
    isSearching: boolean,
    search: (search: LibgenSearch) => void
}

function useSearch(): useSearchType {
    const [searchResults, setSearchResults] = useState<Book[]>([])
    const [isSearching, setIsSearching] = useState<boolean>(false)

    const onSearch = (searchQuery: LibgenSearch) => {
        setIsSearching(true)
        NouvelleAPI.search(searchQuery).then(books => {
            setSearchResults(books)
            setIsSearching(false)
        })
            .catch(error => {
                setIsSearching(false)
                setSearchResults([])
                console.log("[MAIN] Failed to search")
            })

    }
    return {
        searchResults,
        search: onSearch,
        isSearching
    }
}

export { useSearch }
export type { useSearchType }
