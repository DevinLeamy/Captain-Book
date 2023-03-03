import React from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../../hooks/useAuth"

import "./Navbar.css"

const Navbar = () => {
    const { authenticated, onLogin } = useAuth()
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
                {!authenticated && (
                    <div className="navbar-link login-button" onClick={onLogin}>
                        Login
                    </div>
                )}
            </div>
        </div>
    )
}

export { Navbar }
