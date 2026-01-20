import React from "react";
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
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Header />          
          <MainBody />
          <ButtonCount />
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
