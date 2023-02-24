import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { HomePage } from "./home/HomePage";
import { Navbar } from './navbar/Navbar';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="main-container">
        <Navbar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
