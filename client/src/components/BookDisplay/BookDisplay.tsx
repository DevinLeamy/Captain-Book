import React, { ReactNode } from "react"
import { useAuth } from "../../hooks/useAuth"

import "./BookDisplay.css"

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
    const { authenticated } = useAuth()
    return (
        <div className="book-display-container">
            {before !== null && before}
            {after !== null && after}
            {before === null && after === null && (
                <table className="book-display-table">
                    <thead>
                        <tr className="book-display-thead">
                            <th>Title</th>
                            <th>Author</th>
                            <th>Year</th>
                            <th>Format</th>
                            <th>Download</th>
                            <th>Send to Kindle</th>
                            {authenticated && <th>Add to Library</th>}
                        </tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            )}
        </div>
    )
}

export { BookDisplay }
