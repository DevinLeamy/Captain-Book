import { API_URL } from "./config"

type RequestArgs<T> = {
    body?: T
    accessToken?: string
}

const request = <T>(endpoint: string, args?: RequestArgs<T>): Promise<Response> => {
    let url = `${API_URL}${endpoint}`
    if (args?.body !== undefined) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${args?.accessToken}`,
            },
            body: JSON.stringify(args.body),
        })
    } else {
        return fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${args?.accessToken}`,
            },
        })
    }
}

export { request }
