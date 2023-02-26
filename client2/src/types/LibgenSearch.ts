
export type LibgenSearch = {
    query: {
        type: "TITLE" | "AUTHOR",
        text: string
    },
    filter: {
        languages: string[], 
        formats: string[]
    }
}
