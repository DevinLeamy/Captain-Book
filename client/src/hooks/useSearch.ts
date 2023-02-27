import { useState } from "react";

import { NouvelleAPI } from "../api/api";
import { Book } from "../types/Book";
import { LibgenSearch } from "../types/LibgenSearch";

type SearchStatus = "idle" | "finished" | "waiting" | "failed";
type useSearchType = {
    searchResults: Book[];
    searchStatus: SearchStatus;
    search: (search: LibgenSearch) => void;
};

function useSearch(): useSearchType {
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");

    const onSearch = (searchQuery: LibgenSearch) => {
        setSearchStatus("waiting");
        NouvelleAPI.search(searchQuery)
            .then((books) => {
                setSearchResults(books);
                setSearchStatus("finished");
            })
            .catch((error) => {
                setSearchStatus("failed");
                setSearchResults([]);
                console.log("[MAIN] Failed to search");
            });
    };
    return {
        searchResults,
        search: onSearch,
        searchStatus,
    };
}

export { useSearch };
export type { useSearchType };
