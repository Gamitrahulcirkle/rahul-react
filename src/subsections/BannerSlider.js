import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/swiper-bundle.css';
import { metaobjectSliderImage } from '../shopifyAPI';


const BannerSlider = () => {
  const[banners, setBanner] = useState([]);
  useEffect(()=>{
    async function loadBanner(){
      const sliderData = await metaobjectSliderImage();                
      setBanner(sliderData)
    }
    loadBanner();
  },[]);


  // const banners = [
  //   { id: 1, src: 'https://cdn.shopify.com/s/files/1/0664/1100/4089/files/hero-main.png?v=1733911073', alt: 'Banner 1' },
  //   { id: 2, src: 'https://cdn.shopify.com/s/files/1/0664/1100/4089/files/col_banner_02.png?v=1733911073', alt: 'Banner 2' },
  //   { id: 3, src: 'https://cdn.shopify.com/s/files/1/0664/1100/4089/files/col_banner_01.png?v=1733911073', alt: 'Banner 3' },
  //   { id: 4, src: 'https://cdn.shopify.com/s/files/1/0664/1100/4089/files/shop_bg.jpg?v=1733911071', alt: 'Banner 4' },
  // ];
if (!banners.length) return <p>Loading...</p>;

const normalizeBanner = (banner) => {
  const obj = {};
  banner.data.forEach((field) => {
    if (field.key === "image" && field.reference?.image) {
      obj.image = field.reference.image.url;
      obj.alt = field.reference.image.altText || "";
    } else {
      obj[field.key] = field.value;
    }
  });

  return {
    id: banner.id,
    ...obj,
  };
};

const slides = banners.map(normalizeBanner);
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 30000, disableOnInteraction: false }}
      navigation={true}
      pagination={{ clickable: true }}
      modules={[Autoplay, Navigation, Pagination]}
    >
      {/* { banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <img src={banner.src} alt={banner.alt} style={{ width: '100%', height: 'auto' }} />
        </SwiperSlide>
      )) } */}

      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="banner-slide">
            <img
              src={slide.image}
              alt={slide.alt}
              style={{ width: "100%", height: "auto" }}
            />
            <div className='banner_contents'>
              {slide.heading && <h2>{slide.heading}</h2>}
              {slide.sub_heading && <p>{slide.sub_heading}</p>}

              {slide.button_url && (
                <a href={slide.button_url} className="btn">
                  {slide.button_text}
                </a>
              )}
            </div>  
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerSlider;
