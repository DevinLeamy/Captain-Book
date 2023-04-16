import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import "./index.css"
import { AuthContextProvider } from "auth/AuthContext"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </React.StrictMode>
)
