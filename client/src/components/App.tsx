import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Main } from "./Main/Main";

import "./App.css";
import { Navbar } from "./navbar/Navbar";

const App = () => {
    return (
        <Router>
            <div className="main-container">
                <Navbar />
                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<Main />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
