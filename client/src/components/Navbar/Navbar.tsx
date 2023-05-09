import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../hooks/useAuth"
import { useLocation } from "react-router-dom"

import "./Navbar.css"

const Navbar = () => {
    const { authenticated, onLogin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation().pathname
    return (
        <div className="navbar-container">
            <div
                className="navbar-left hover:cursor-pointer container mx-auto"
                onClick={() => {
                    navigate("/")
                }}
            >
                <div className="flex items-center">
                    <img
                        className="h-12 p-2 w-auto mr-2"
                        src={require("assets/images/captainbook2.jpeg")}
                        alt="Captain Book Logo"
                    />
                    <h1 className="text-2xl font-serif italic font-semibold text-white hover:underline">
                        Captain Book
                    </h1>
                </div>
            </div>
            <div className="navbar-right">
                {!authenticated && (
                    <div className="navbar-link hover:cursor-pointer" onClick={onLogin}>
                        Login
                    </div>
                )}
                {authenticated && (
                    <>
                        <Link
                            className={`navbar-link ${
                                location === "/library" ? "selected-link" : ""
                            }`}
                            to={"./library"}
                        >
                            Library
                        </Link>
                        <Link
                            className={`navbar-link ${
                                location === "/search" ? "selected-link" : ""
                            }`}
                            to={"./search"}
                        >
                            Search
                        </Link>
                        <Link
                            className={`navbar-link ${
                                location === "/account" ? "selected-link" : ""
                            }`}
                            to={"./account"}
                        >
                            Account
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export { Navbar }
