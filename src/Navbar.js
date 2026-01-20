import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from 'react';
import './Navbar.css'; // Make sure to create the corresponding CSS file
import AboutUs from "./pages/AboutUs";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo">My React App</h1>
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/pdp">Product</Link></li>
              <li><Link to="/pdp">All collections</Link></li>
            </ul>
          </nav>
          <div className="menu-toggle" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </header>

      {/* <Routes>        
        <Route path="/about" element={<AboutUs />} />
      </Routes> */}
    </>
  );
}

export default Navbar;
