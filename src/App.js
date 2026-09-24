import React, { useState } from "react";
import Header from "./components/Header";
import MainBody from "./components/MainBody";
import Footer from "./components/Footer";
import { BrowserRouter, Router, Switch } from "react-router-dom";
import ButtonCount from "./Button";

function boxes(){
  return(
    <button >
    </button>
  )
} 
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Header setIsCartOpen={setIsCartOpen} cart={cart} setCart={setCart}/>          
          <MainBody 
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            cart={cart}
            setCart={setCart}
          />
          <ButtonCount />
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
