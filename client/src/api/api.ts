import { Book } from "../types/Book";
import { LibgenSearch } from "../types/LibgenSearch";

const API_URL = "http://127.0.0.1:8080"

interface INouvelleAPI {
    search: (search: LibgenSearch) => Promise<Book[]>,
    download: (book: Book) => Promise<File | undefined>,
    sendToKindle: (kindleEmail: string, book: Book) => Promise<boolean>
}

const search = async (search: LibgenSearch): Promise<Book[]> => {
    let response = await fetch(`${API_URL}/libgen/search`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(search)
    });
    response = await response.json()

    return response as unknown as Book[]
}

const download = async (book: Book): Promise<File | undefined> => {
    const response = await fetch(`${API_URL}/libgen/download`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(book)
    })
    if (!response.ok) {
        return undefined
    }
    let fileBlob: any = await response.blob()
    fileBlob.lastModifiedDate = new Date()
    fileBlob.name = book.title
    return fileBlob as File
}

/**
 * Sends {book} to {kindleEmail}. 
 * Returns whether the request succeeded.
 */
const sendToKindle = async (kindleEmail: string, book: Book): Promise<boolean> => {
    const request = await fetch(`${API_URL}/kindle/send`, {
        method: 'POST', 
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            kindleEmail,
            book
        })
    })

    return request.ok
}

export const NouvelleAPI: INouvelleAPI = {
    search,
    download,
    sendToKindle
}
