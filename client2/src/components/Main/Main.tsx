import React, { useState } from "react"
import TextField from '@mui/material/TextField';
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

import { Book } from "../../Book"
import { BookComponent } from "../Book/Book"
import { BookDisplay } from "../BookDisplay/BookDisplay"

import "./Main.css"

type BookFormat = "epub" | "pdf" | "mobi"
type BookCategory = "non-fiction" | "fiction"

type SearchQuery = {
    queryString: string,
    allowedFormats: BookFormat[],
    searchCategory: BookCategory
}

const search = async (title: string): Promise<Book[]> => {
    console.log(`Searching for ${title}`)
    let response = await fetch(`http://127.0.0.1:8080/libgen/${title}`, {
        method: 'GET',
    });
    response = await response.json()

    return response as unknown as Book[]
}

type useSearchType = {
    searchResults: Book[],
    isSearching: boolean,
    search: (search: SearchQuery) => void
}

function useSearch(): useSearchType {
    const [searchResults, setSearchResults] = useState<Book[]>([])
    const [isSearching, setIsSearching] = useState<boolean>(false)

    const onSearch = (searchQuery: SearchQuery) => {
        setIsSearching(true)
        search(searchQuery.queryString).then(books => {
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

export const Main = () => {
    const [queryString, setQueryString] = useState<string>("")
    const { searchResults, search, isSearching } = useSearch()
    const [searchFormats, setSearchFormats] = useState<string[]>(["all"])
    const [searchCategory, setSearchCategory] = useState<BookCategory>("fiction")

    const onSubmitSearch = () => {
        console.log("[MAIN] Submitted search")
        search({
            queryString,
            allowedFormats: searchFormats.filter(format => format !== "all") as BookFormat[],
            searchCategory
        })
    }

    const onSearchFormatChange = (_e: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
        setSearchFormats(newFormats)
    }

    const onSearchCategoryChange = (_e: React.MouseEvent<HTMLElement>, newCategory: BookCategory) => {
        setSearchCategory(newCategory)
    }

    return (
        <div className="main-c-container">
            <TextField
                fullWidth
                id="search-input"
                size="medium"
                label="Search"
                variant="outlined"
                onChange={e => setQueryString(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        onSubmitSearch()
                    }
                }}
            />
            <div className="search-options-container">
                <ToggleButtonGroup
                    value={searchFormats}
                    onChange={onSearchFormatChange}
                >
                    <ToggleButton size="small" value="all">All</ToggleButton>
                    <ToggleButton size="small" value="epub">EPUB</ToggleButton>
                    <ToggleButton size="small" value="mobi">MOBI</ToggleButton>
                    <ToggleButton size="small" value="pdf">PDF</ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                    value={searchCategory}
                    exclusive
                    onChange={onSearchCategoryChange}
                >
                    <ToggleButton size="small" value="fiction">Fiction</ToggleButton>
                    <ToggleButton size="small" value="non-fiction">Non-fiction</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <BookDisplay before={isSearching ? <h1>Loading...</h1> : null}>
                {searchResults.map(book => <BookComponent book={book} />)}
            </BookDisplay>
        </div>
    )
}

