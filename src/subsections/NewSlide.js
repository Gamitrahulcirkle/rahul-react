import react from "react";
import "../NewSlider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

function NewSlide() {
  let NewSliderBanners = [
    {
      id: 1,
      src: "https://cdn.shopify.com/s/files/1/0664/1100/4089/files/hero-main.png?v=1733911073",
      alt: "Banner 1",
    },
    {
      id: 2,
      src: "https://cdn.shopify.com/s/files/1/0664/1100/4089/files/col_banner_02.png?v=1733911073",
      alt: "Banner 2",
    },
    {
      id: 3,
      src: "https://cdn.shopify.com/s/files/1/0664/1100/4089/files/col_banner_01.png?v=1733911073",
      alt: "Banner 3",
    },
    {
      id: 4,
      src: "https://cdn.shopify.com/s/files/1/0664/1100/4089/files/shop_bg.jpg?v=1733911071",
      alt: "Banner 4",
    },
  ];
  return (
    <>
      <div className="page-width">
        <div className="main-wrap">
          <div className="left-sidebar">
            <div className="memu_list">
              <ul>
                <li>Woman’s Fashion</li>
                <li>Men’s Fashion</li>
                <li>Electronics</li>
                <li>Home & Lifestyle</li>
                <li>Medicine</li>
                <li>Sports & Outdoor</li>
                <li>Baby’s & Toys</li>
                <li>Groceries & Pets</li>
                <li>Health & Beauty</li>
              </ul>
            </div>
          </div>
          <div className="right_slide">
            <div className="wrap_inner">
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 30000, disableOnInteraction: false }}
                navigation={true}
                pagination={{ clickable: true }}
                modules={[Autoplay, Navigation, Pagination]}
              >
                {NewSliderBanners.map((banner) => (
                  <SwiperSlide key={banner.id}>
                    <div className="slider">
                      <div className="inner_left">
                        <div className="inner_box">
                          <div className="img_text">
                            <img src="" />
                            <p>iPhone 14 Series</p>
                          </div>
                          <h2>
                            Up to 10% <br />
                            off Voucher
                          </h2>
                          <button>Shop Now</button>
                        </div>
                      </div>
                      <div className="inner_right">
                        <img
                          src={banner.src}
                          alt={banner.alt}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewSlide;
