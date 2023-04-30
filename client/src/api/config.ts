/**
 * Set API url for development and production environments.
 */
const API_URL =
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:8080" : "http://api.captainbook.ca"

export { API_URL }
