import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from 'react';
import './Navbar.css'; // Make sure to create the corresponding CSS file
import AboutUs from "./pages/AboutUs";

function Navbar({ setIsCartOpen, cart, setCart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  function cartActions(cart, setCart) {
    setIsCartOpen(true);
    setCart(cart);
    console.log("Cart Opened");
  }

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo">Shopify</h1>
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/pdp">Product</Link></li>
              <li><Link to="/pdp">All collections</Link></li>
              <li onClick={() => cartActions(cart, setCart)}>View Cart</li>
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
