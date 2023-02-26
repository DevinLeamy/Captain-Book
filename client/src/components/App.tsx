import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Main } from "./Main/Main";

import "./App.css";
import { Navbar } from "./navbar/Navbar";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const App = () => {
    return (
        <Router>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div className="main-container">
                    <Navbar />
                    <div className="page-container">
                        <Routes>
                            <Route path="/" element={<Main />} />
                        </Routes>
                    </div>
                </div>
            </ThemeProvider>
        </Router>
    );
};

export default App;
