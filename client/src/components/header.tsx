import { useState, useRef, FormEvent, Dispatch } from "react"
import { Book } from "./book"
import "./header.css"

const bookCover = async (url: string): Promise<string> => {
    let response = await fetch(url, {
        method: 'GET'
    })
    let imageBlob = await response.blob()
    let newUrl = URL.createObjectURL(imageBlob)

    return newUrl
}

const search = async (title: string): Promise<unknown> => {
    console.log(`Searching for ${title}`)
    let response = await fetch(`http://127.0.0.1:8080/libgen/${title}`, {
        method: 'GET',
    });
    response = await response.json()
    return response
}

const HeaderComponent = ({ setBooks }: { setBooks: Dispatch<Book[]> }) => {
    const noResults = false
    const [error, _setError] = useState<boolean>(false)
    const searchTerm = useRef<string>("")

    const onSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        let response = await search(searchTerm.current) 
        let books = response as Book[]
        // for (let i = 0; i < books.length; ++i) {
        //     books[i].coverurl = await bookCover(books[i].coverurl)
        // }
        setBooks(books)
    }

    return (
        <div id="header">
            <div className="logo">YMAEL</div>
            <div className="search-container">
                <form className="search-bar" onSubmit={onSearch}>
                    <input
                        onChange={e => searchTerm.current = e.currentTarget.value}
                        className="search-input"
                        type="text"
                        placeholder="Find a book..."
                    />
                    <button className="search-button" type="submit">
                        <i className="fas fa-search" />
                        <p className="search-button-text">Search</p>
                    </button>
                </form>
                {error && <p className="error">
                    Search must be atleast 4 characters
                </p>}
                {noResults && <p className="error">
                    No results
                </p>}
            </div>
        </div>
    );
}

export { HeaderComponent };
