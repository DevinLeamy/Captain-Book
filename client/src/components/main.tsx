import { useState } from "react"

import { HeaderComponent } from "./header"
import { LoadingComponent } from "./loading"
import { BooksListComponent } from "./books-list"
import { Book } from "./book"

const MainComponent = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [isLoading, _setIsLoading] = useState<boolean>(false)

    return (
        <div id="main">
            <HeaderComponent
                setBooks={setBooks}
            />
            <BooksListComponent 
                books={books} 
            />
            <LoadingComponent
                loading={isLoading}
            />
        </div>

        
    )
}

export { MainComponent }
