import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { SearchPage } from "./SearchPage/SearchPage"
import { Navbar } from "./Navbar/Navbar"
import { LibraryComponent } from "./Library/Library"
import { AuthContextProvider } from "../auth/AuthContext"

import "./App.css"

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
})

const App = () => {
    return (
        <Router>
            <AuthContextProvider>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <div className="main-container">
                        <Navbar />
                        <div className="page-container">
                            <Routes>
                                <Route path="/" element={<SearchPage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route
                                    path="/library"
                                    element={
                                        <LibraryComponent
                                            unauthenticated={<h3>Login to access your library.</h3>}
                                        />
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                </ThemeProvider>
            </AuthContextProvider>
        </Router>
    )
}

export default App
