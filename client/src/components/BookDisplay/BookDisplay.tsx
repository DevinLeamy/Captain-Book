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
                            <td>Title</td>
                            <td>Author</td>
                            <td>Format</td>
                            <td>Download</td>
                            <td>Send to Kindle</td>
                        </tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            )}
        </div>
    );
};

export { BookDisplay };
