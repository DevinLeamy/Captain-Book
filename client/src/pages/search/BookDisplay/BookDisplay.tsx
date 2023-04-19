import React, { ReactNode } from "react"

import "./BookDisplay.css"

/**
 * TODO: Separate this component into BookDisplay and BookTableDisplay.
 */

type BookDisplayProps = {
    /// Display while searching.
    before: ReactNode
    /// Display after search is complete.
    /// E.g: to show that no results were found.
    after: ReactNode
    children: ReactNode
}

/// Display a set of books passed in as children.
const BookDisplay = ({ before, after, children }: BookDisplayProps) => {
    return (
        <div className="book-display-container">
            {before !== null && before}
            {after !== null && after}
            {before === null && after === null && (
                <table className="table-head w-full h-full max-h-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Year</th>
                            <th>Format</th>
                            <th>Download</th>
                            <th>Send to Kindle</th>
                            <th>Add to Library</th>
                        </tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            )}
        </div>
    )
}

export { BookDisplay }
