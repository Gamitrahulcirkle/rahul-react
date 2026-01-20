import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { fetchProducts, addToCart, createCart, fetchCartData } from '../shopifyAPI';
import {createCheckout} from '../shopifyCheckout';

const ProductsList = () => {
  const [products, setProducts] = useState([]);  
  const[ cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState(null);


  useEffect(() => {
    const getProducts = async () => {
      const productList = await fetchProducts();   
      //setCursorStack(prev => [...prev, pageInfo.startCursor]);   
      setProducts(productList);
      //setPageInfo(pageInfo);
      setLoading(false);
    };
 
    getProducts();   
  }, []);
  
  useEffect(() =>  {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];    
    setCart(storedCart);
  }, []);

  const ensureCart = async () => {
    if (cartId) return cartId;

    const newCartId = await createCart();
    setCartId(newCartId);
    return newCartId;
  };
  const fetchCart = async(validCartId) =>{
    const cartItems = await fetchCartData();
    console.log("cartItems ==>");
    console.log(cartItems);
  }
  const handleAddToCart = async (product)=> {  
    const variantId = product.variants.edges[0].node.id;
    const validCartId = await ensureCart();
    const updatedLines = await addToCart(validCartId, variantId);
    const CartData = await fetchCart(validCartId);
    console.log(updatedLines);
    // const updatedCart = [...cart, product];
    setCart(updatedLines);
    // localStorage.setItem('cart', JSON.stringify(updatedCart));
    setIsCartOpen(true);
  }

  const handleRemoveFromCart = (itemToRemove) => {    
    const updatedCart = cart.filter(item => item.id !== itemToRemove.id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  if (loading) {
    return <p>Loading products...</p>;
  }
  
  const subtotal = cart.reduce((acc, item) => {
    console.log(acc);
    console.log(item.merchandise.price.amount);
    //const price =parseFloat(item.variants.edges[0].node.price.amount);
    //return acc + price;
    const price = parseFloat(item.merchandise.price.amount);
    const qty = parseFloat(item.merchandise.quantity);
    return qty + price;
  }, 0);

  return (
    <div>
      <div className="product-lists" id="products">
        <h1>Products</h1>
        <ul className='product-list-ele'>          
          { products.map((product) => (            
            <li key={product.id}>
              <p>{product.description}</p>
              { product.images.edges.length > 0 && (
                <img
                  src={product.images.edges[0].node.src}
                  alt={product.title}
                  style={{ width: '100px' }}
                />
              )}
              <Link to={`/products/${product.handle}`}>
                <h2>{product.title}</h2>
              </Link>
              <div>Rs.{ product.variants.edges[0].node.price.amount }</div>
              <button onClick={()=>handleAddToCart(product)}>Add to cart</button>
            </li>
          ))}
        </ul>
      </div>

      {isCartOpen && (
        <div className="cart-drawer">
          <div className='header_wrap'>
              <button onClick={() => setIsCartOpen(false)}>X</button>
              <h2>Your Shopping Cart</h2>
          </div>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '20px', marginTop: 'auto' }}>Your cart is empty.</p>
            ) : (            
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  <div className='item_wrap'>
                    <div className='item_img'>
                      { item.merchandise.product.images && (
                        <img
                          src={ item.merchandise.product.images.nodes[0]?.url }
                          alt={ item.merchandise.product.title }
                          style={{ width: '100px' }}
                        />
                      )}
                    </div>
                    <div className='item_detail'>
                      <h3>{ item.merchandise.product.title }</h3>
                      <div> Rs { item.merchandise.price.amount } </div>
                      <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          { cart.length > 0 && (            
            <div className='checkout_form_wrap'>
              <div>Subtotal: Rs { subtotal.toFixed(2) }</div>
              <div>
                <button>
                  <a href='/cart'>View Cart</a>
                </button>
              </div>
              <div>
                 <button
                  onClick={async () => {
                    const checkoutUrl = await createCheckout(cart);                    
                    if (checkoutUrl) {
                      console.log( checkoutUrl );
                      window.location.href = checkoutUrl;
                    } else {
                      alert("Something went wrong during checkout.");
                    }
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}          
        </div>
      )}
    </div>
  );
};

export default ProductsList;
