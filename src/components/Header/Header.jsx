import React from "react";
import reactLogo from "../../assets/react.svg";
import "../../assets/header.css";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
    { path: "/user", name: "User" }
  ];

  return (
    <header>
      {/* Left Side Menu */}
      <div className="left-side-menu">
        <nav className="left-menu">
          <ul className="menu">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => isActive ? "active-link" : ""}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logo Section */}
      <div className="logo-menu">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>

      {/* Right Side Menu */}
      <div className="right-menu">
        <ul className="menu">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Get Started</Link></li>
        </ul>
      </div>
    </header>
  );
}
