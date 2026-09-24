import React from "react";
import ProductsList from "../subsections/ProductList";
import BannerSlider from "../subsections/BannerSlider";
import NewSlide from "../subsections/NewSlide";

const Home = ({ isCartOpen, setIsCartOpen, cart, setCart }) => {
  return (
    <>    
      {/* <NewSlide /> */}
      <BannerSlider />
      <ProductsList isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} cart={cart} setCart={setCart} />
    </>
  );
};

export default Home;
