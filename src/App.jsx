// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Routes, Route } from "react-router-dom";
import React from 'react'
import Header from './components/Header/Header'
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from './components/Contact/Contact';
import User from './components/User/User';


function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path='' element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='user' element={<User />} />  
        </Routes> 
      </div>
    </>
  )
}

export default App
