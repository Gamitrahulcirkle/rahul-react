import React from "react";
import {Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import ProductDetail from "./Pdp";

function MainBody() {
  return (
    <main>        
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products/:handle" element={<ProductDetail />} />
      </Routes>
    </main>
  );
}
export default MainBody;
