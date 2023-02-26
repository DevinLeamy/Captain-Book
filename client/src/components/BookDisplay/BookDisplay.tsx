import React, { ReactNode } from "react";

import "./BookDisplay.css";

type BookDisplayProps = {
    before: ReactNode;
    children: ReactNode;
};

/// Display a set of books passed in as children.
const BookDisplay = ({ before, children }: BookDisplayProps) => {
    return (
        <div className="book-display-container">
            {before !== null && before}
            {before === null && (
                <table className="book-display-table">
                    <thead>
                        <tr className="book-display-thead">
                            <th>Title</th>
                            <th>Author</th>
                            <th>Format</th>
                            <th>Download</th>
                            <th>Send to Kindle</th>
                        </tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            )}
        </div>
    );
};

export { BookDisplay };
