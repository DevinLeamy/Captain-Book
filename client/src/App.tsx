import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Search from "pages/search/SearchPage"
import { Navbar } from "Navbar/Navbar"
import Library from "pages/library/Library"
import { AuthContextProvider } from "auth/AuthContext"

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
                                <Route path="/" element={<Search />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/account" element={<Search />} />
                                <Route path="/library" element={<Library />} />
                                <Route path="/*" element={<div>404 Page not found.</div>} />
                            </Routes>
                        </div>
                    </div>
                </ThemeProvider>
            </AuthContextProvider>
        </Router>
    )
}

export default App
