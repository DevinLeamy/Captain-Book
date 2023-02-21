import { useState, useRef, FormEvent, Dispatch } from "react"
import { Book } from "./book"
import "./header.css"

const search = async (title: string): Promise<unknown> => {
    console.log(`Searching for ${title}`)
    let response = await fetch(`http://127.0.0.1:8000/books`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({
            title
          })
    });
    return response
}

const HeaderComponent = ({ setBooks }: { setBooks: Dispatch<Book[]> }) => {
    const noResults = false
    const [error, _setError] = useState<boolean>(false)
    const searchTerm = useRef<string>("")

    const onSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        search(searchTerm.current)
            .then(_ => console.log("Got response!"))
            .catch(err => console.log(err))
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
