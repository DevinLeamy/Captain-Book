import React, { ReactNode, useState } from "react";
import TextField from "@mui/material/TextField";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { Book, BookCategory, BookFormat } from "../../types/Book";
import { BookComponent } from "../Book/Book";
import { BookDisplay } from "../BookDisplay/BookDisplay";
import { SearchBar } from "../SearchBar/SearchBar";

import "./Main.css";
import { useSearch } from "../../hooks/useSearch";

export const Main = () => {
    const { searchResults, search, searchStatus } = useSearch();
    const [searchFormats, setSearchFormats] = useState<string[]>(["epub", "mobi", "pdf"]);
    const [searchCategory, setSearchCategory] = useState<BookCategory>("fiction");

    const onSubmitSearch = (queryString: string) => {
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

    const loadingDisplay = (): ReactNode => {
        if (searchStatus === "waiting") {
            return <h2>Loading...</h2>;
        }
        return null;
    };

    const loadedDisplay = (): ReactNode => {
        if (searchStatus === "finished" && searchResults.length === 0) {
            return <h2>No results founds.</h2>;
        } else if (searchStatus === "failed") {
            return <h2>Search failed.</h2>;
        }
        return null;
    };

    return (
        <div className="main-c-container">
            <SearchBar onSubmit={onSubmitSearch} />
            <div className="search-options-container">
                <ToggleButtonGroup value={searchFormats} onChange={onSearchFormatChange}>
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
            <BookDisplay before={loadingDisplay()} after={loadedDisplay()}>
                {searchResults.map((book) => (
                    <BookComponent key={book.md5} book={book} />
                ))}
            </BookDisplay>
        </div>
    );
};
