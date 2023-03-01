import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
    return (
        <div className="navbar-container">
            <div className="navbar-left">Nouvelle</div>
            <div className="navbar-right">
                <Link className="navbar-link" to={"./search"}>
                    Search
                </Link>
                <Link className="navbar-link" to={"./library"}>
                    Library
                </Link>
            </div>
        </div>
    );
};

export { Navbar };
