import React from "react";
import {Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import ProductDetail from "./Pdp";

function MainBody({ isCartOpen, cart, setCart, setIsCartOpen }) {
  return (
    <main>        
      <Routes>
        <Route path="/" element={<Home setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} cart={cart} setCart={setCart} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products/:handle" element={<ProductDetail />} />
      </Routes>
    </main>
  );
}
export default MainBody;
