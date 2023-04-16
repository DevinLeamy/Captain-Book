import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Search from "pages/search/SearchPage"
import Library from "pages/library/LibraryPage"
import Account from "pages/account/AccountPage"
import Home from "pages/home/HomePage"
import { Navbar } from "components/Navbar/Navbar"

import "./App.css"
import { useAuth } from "hooks/useAuth"

const App = () => {
    const { authenticated } = useAuth()

    return (
        <Router>
            <ThemeProvider
                theme={createTheme({
                    palette: {
                        mode: "dark",
                    },
                })}
            >
                <CssBaseline />
                <div className="main-container">
                    <Navbar />
                    <div className="page-container">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/search" element={authenticated ? <Search /> : <Home />} />
                            <Route
                                path="/account"
                                element={authenticated ? <Account /> : <Home />}
                            />
                            <Route
                                path="/library"
                                element={authenticated ? <Library /> : <Home />}
                            />
                            <Route path="/*" element={<div>404 Page not found.</div>} />
                        </Routes>
                    </div>
                </div>
            </ThemeProvider>
        </Router>
    )
}

export default App
