import { ReactNode } from "react"
import { Grid } from "@mui/material"

import "./BookDisplay.css"

type BookDisplayProps = {
    before: ReactNode,
    children: ReactNode 
}

/// Display a set of books passed in as children.
const BookDisplay = ({ before, children }: BookDisplayProps) => {
    return (
        <div className="book-display-container">
            <Grid spacing={3} rowSpacing={3} container>
                {before !== null && before}
                {before === null && children}
            </Grid>
        </div>
    )
}

export { BookDisplay }
