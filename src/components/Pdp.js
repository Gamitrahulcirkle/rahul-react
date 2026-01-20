import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductByHandle } from "../shopifyAPI";

const Pdp = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const[ cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const productDetail = await fetchProductByHandle(handle);
      setProduct(productDetail);
    };
    loadProduct();
  }, [handle]);

  function decreseQty(){
    setQty((prevQty) => {
      const newQty = Math.max(prevQty - 1, 1);
      console.log(`DecreaseQTY ${newQty}`);
      return newQty;
    });
  }

  function increseQty(){
    setQty((prevQty) => {
      const newQty = prevQty + 1;
      console.log(`IncreaseQTY ${newQty}`);
      return newQty;
    }); 
  }


  const handleAddToCart = (product)=> {  
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setIsCartOpen(true);
  }

  const handleRemoveFromCart = (itemToRemove) => {
    const updatedCart = cart.filter(item => item.id !== itemToRemove.id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  if (!product) return <p>Loading product...</p>;
  const variant = product.variants.edges[0].node;
  const price = variant?.price?.amount;
  const compareAtPrice = variant?.compareAtPrice?.amount;

  return (    
    <div className="pdp page-width">
      <div className="pdp__wrapper">
        {/* Product Images */}
        <div className="pdp__media">
          <img
            src={product.images.edges[0].node.src}
            alt={product.title}
            className="pdp__main-image"
          />
        </div>

        {/* Product Info */}
        <div className="pdp__info">
          <p className="pdp__vendor">Hydrogen Vendor</p>
          <h1 className="pdp__title">{product.title}</h1>

          <div className="pdp__price">
            { compareAtPrice && <span> <s> Rs.{ compareAtPrice }</s></span> }
            { price && <span> Rs.{ price }</span> }
          </div>

          {/* Quantity Selector */}
          <div className="pdp__quantity">
            <label htmlFor="quantity_main">Quantity</label>
            <div className="pdp__quantity-controls">
              <button className="qty-btn minus-qty" aria-label="Decrease quantity" onClick={decreseQty} >
                −
              </button>
              <input
                className="quantity__input"
                type="number"
                id="quantity_main"
                min="1"
                step="1"
                value={qty}
                defaultValue={qty}
                onChange={(e) => setQty(Math.max(Number(e.target.value), 1))}
              />
              <button className="qty-btn plus-qty" aria-label="Increase quantity" onClick={increseQty}>
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <div
            className="pdp__description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* Add to Cart */}
          <div className="pdp__form">
            <button type="button" className="pdp__add-to-cart" onClick={()=>handleAddToCart(product)}>
              Add to cart
            </button>
          </div>

          {/* Accordion */}
          <div className="pdp__accordion">
            {[...Array(3)].map((_, i) => (
              <details key={i}>
                <summary>Product Detail {i + 1}</summary>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus blandit.
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pdp;
