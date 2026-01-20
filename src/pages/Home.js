import React from "react";
import ProductsList from "../subsections/ProductList";
import BannerSlider from "../subsections/BannerSlider";
import NewSlide from "../subsections/NewSlide";

const Home = () => {
  return (
    <>    
      {/* <NewSlide /> */}
      <BannerSlider />
      <ProductsList />
    </>
  );
};

export default Home;
