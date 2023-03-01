import React from "react";
import { SearchBar } from "../SearchBar/SearchBar";

import "./Library.css";

export const LibraryComponent = () => {
    const onSubmitSearch = (queryString: string) => {};
    return (
        <div className="library-container">
            <SearchBar onSubmit={onSubmitSearch} />
            <div>Library</div>;
        </div>
    );
};
