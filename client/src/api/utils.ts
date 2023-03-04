const API_URL = "http://127.0.0.1:8080"

const request = <T>(
    endpoint: string,
    body: T | undefined = undefined,
    accessToken: string | undefined = undefined
): Promise<Response> => {
    let url = `${API_URL}${endpoint}`
    if (body !== undefined) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        })
    } else {
        return fetch(url, {
            method: "GET",
        })
    }
}

export { request }
