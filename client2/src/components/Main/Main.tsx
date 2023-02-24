import React, { useState } from "react"
import TextField from '@mui/material/TextField';

import { Book } from "../../Book"
import { BookComponent } from "../Book/Book"
import { BookDisplay } from "../BookDisplay/BookDisplay"

import "./Main.css"
import { FormControl } from "@mui/material";
import FormGroup from "@material-ui/core/FormGroup";

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
    search: (search: string) => void
}

function useSearch(): useSearchType {
    const [searchResults, setSearchResults] = useState<Book[]>([])
    const [isSearching, setIsSearching] = useState<boolean>(false)

    const onSearch = (searchQuery: string) => {
        setIsSearching(true)
        search(searchQuery).then(books => {
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
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { searchResults, search, isSearching } = useSearch()

    const onSubmitSearch = () => {
        console.log("[MAIN] Submitted search")
        search(searchQuery)
    }

    return (
        <div className="main-c-container">
            <TextField
                fullWidth
                id="search-input"
                size="medium"
                label="Search"
                variant="outlined"
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        onSubmitSearch()
                    }
                }}
            />
            <BookDisplay before={isSearching ? <h1>Loading...</h1> : null}>
                {searchResults.map(book => <BookComponent book={book} />)}
            </BookDisplay>
        </div>
    )
}

