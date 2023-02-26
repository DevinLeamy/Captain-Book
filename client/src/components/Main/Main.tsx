import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { Book, BookCategory, BookFormat } from "../../types/Book";
import { BookComponent } from "../Book/Book";
import { BookDisplay } from "../BookDisplay/BookDisplay";

import "./Main.css";
import { useSearch } from "../../hooks/useSearch";

export const Main = () => {
    const [queryString, setQueryString] = useState<string>("");
    const { searchResults, search, isSearching } = useSearch();
    const [searchFormats, setSearchFormats] = useState<string[]>(["all"]);
    const [searchCategory, setSearchCategory] = useState<BookCategory>("fiction");

    const onSubmitSearch = () => {
        console.log("[MAIN] Submitted search");
        search({
            query: {
                type: "title",
                text: queryString,
                category: searchCategory,
            },
            filter: {
                formats: searchFormats.filter((format) => format !== "all") as BookFormat[],
                languages: ["english"],
            },
        });
    };

    const onSearchFormatChange = (_e: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
        setSearchFormats(newFormats);
    };

    const onSearchCategoryChange = (
        _e: React.MouseEvent<HTMLElement>,
        newCategory: BookCategory
    ) => {
        setSearchCategory(newCategory);
    };

    return (
        <div className="main-c-container">
            <TextField
                fullWidth
                id="search-input"
                size="medium"
                label="Search"
                variant="outlined"
                onChange={(e) => setQueryString(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSubmitSearch();
                    }
                }}
            />
            <div className="search-options-container">
                <ToggleButtonGroup value={searchFormats} onChange={onSearchFormatChange}>
                    <ToggleButton size="small" value="all">
                        All
                    </ToggleButton>
                    <ToggleButton size="small" value="epub">
                        EPUB
                    </ToggleButton>
                    <ToggleButton size="small" value="mobi">
                        MOBI
                    </ToggleButton>
                    <ToggleButton size="small" value="pdf">
                        PDF
                    </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                    value={searchCategory}
                    exclusive
                    onChange={onSearchCategoryChange}
                >
                    <ToggleButton size="small" value="fiction">
                        Fiction
                    </ToggleButton>
                    <ToggleButton size="small" value="non-fiction">
                        Non-fiction
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <BookDisplay before={isSearching ? <h1>Loading...</h1> : null}>
                {searchResults.map((book) => (
                    <BookComponent key={book.md5} book={book} />
                ))}
            </BookDisplay>
        </div>
    );
};
