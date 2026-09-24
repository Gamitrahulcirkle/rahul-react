import React from "react";
import Navbar from "../Navbar";
function Header({ setIsCartOpen, cart, setCart }) {
    return (
        <header>
            <Navbar setIsCartOpen={setIsCartOpen} cart={cart} setCart={setCart} />
        </header>
    );
}
export default Header;