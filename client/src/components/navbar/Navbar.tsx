import React from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../../hooks/useAuth"
import { useLocation } from "react-router-dom"

import "./Navbar.css"

const Navbar = () => {
    const { authenticated, onLogin, onLogout } = useAuth()
    const location = useLocation().pathname
    return (
        <div className="navbar-container">
            <div className="navbar-left">📚 Nouvelle</div>
            <div className="navbar-right">
                <Link
                    className={`navbar-link ${location === "/search" ? "selected-link" : ""}`}
                    to={"./search"}
                >
                    Search
                </Link>
                <Link
                    className={`navbar-link ${location === "/library" ? "selected-link" : ""}`}
                    to={"./library"}
                >
                    Library
                </Link>
                {!authenticated && (
                    <div className="navbar-link" onClick={onLogin}>
                        Login
                    </div>
                )}
                {authenticated && (
                    <div className="navbar-link" onClick={onLogout}>
                        Logout
                    </div>
                )}
            </div>
        </div>
    )
}

export { Navbar }
