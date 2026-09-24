import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { fetchProducts, addToCart, createCart, fetchCartData, createProductBundle } from '../shopifyAPI';
import {createCheckout} from '../shopifyCheckout';

const ProductsList = ({ isCartOpen, setIsCartOpen, cart, setCart }) => {

  const [products, setProducts] = useState([]);  
  //const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
 // const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const [pageInfo, setPageInfo] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

//   useEffect(() => {
//   if (!isCartOpen) return;

//   const loadCart = async () => {
//     try {
//       const storedCartId = localStorage.getItem("cartID");

//       if (!storedCartId) {
//         console.log("No cart ID found");
//         setCart([]);
//         return;
//       }

//       setCartId(storedCartId);
//       console.log("storedCartId ===>");
//       console.log(storedCartId);
//       const cartItems = await fetchCartData(storedCartId);

//       console.log("Cart items when drawer opened:", cartItems);

//       setCart(cartItems || []);
//     } catch (error) {
//       console.error("Error loading cart:", error);
//       setCart([]);
//     }
//   };

//   loadCart();
// }, [isCartOpen]);


  useEffect(() => {
    const getProducts = async () => {
      const productList = await fetchProducts();   
      console.log("Fetched products:", productList);
      //return;
      //setCursorStack(prev => [...prev, pageInfo.startCursor]);   
      setProducts(productList);
      // setPageInfo(productList.pageInfo);
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

    // 2. Check localStorage BEFORE creating a new cart
    const storedCartId = localStorage.getItem('cartID');
    if (storedCartId) {
      setCartId(storedCartId);
      return storedCartId;
    }

    // 3. Only create a new cart if no existing cart exists
    const newCartId = await createCart();
    setCartId(newCartId);
    return newCartId;

    // const newCartId = await createCart();
    // let cartID = localStorage.getItem('cartID');
    // console.log("ensureCart==>");
    // console.log(cartID);
    // if(cartID){
    //   setCartId(cartID);
    //   return cartID;
    // }else{
    // //localStorage.setItem('cartID', newCartId);
    //   setCartId(newCartId);
    //   return newCartId;
    // }
  };
  const fetchCart = async(validCartId) => {
    const cartItems = await fetchCartData();
    console.log("cartItems ==>");
    console.log(cartItems);
  }
  const createBundles = async (product1, product2) => {
    // console.log(product1)
    // console.log(product2)
    const bundleResult = await createProductBundle(product1,product2);
    console.log( bundleResult );
  }
  const handleAddToCart = async (product)=> {
    console.log("Adding to cart:", product);
    const variantId = product.variants.edges[0].node.id;
    console.log(variantId);
  
    const validCartId = await ensureCart();
    console.log("Valid Cart ID:", validCartId);
    //return; // Exit early to prevent further execution
    const updatedLines = await addToCart(validCartId, variantId);
    const CartData = await fetchCart(validCartId);

    console.log("CartData");
    // console.log(CartData);
    // console.log(updatedLines); 

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

  const handleLoadMore = async () => {
    if (!pageInfo?.hasNextPage || loadingMore) { return; }
    try {
      setLoadingMore(true);

      const result = await fetchProducts(
        12,
        pageInfo.endCursor
      );

      console.log("Next products:", result.products);
      console.log("New Page Info:", result.pageInfo);

      setProducts((previousProducts) => [
        ...previousProducts,
        ...result.products,
      ]);

      setPageInfo(result.pageInfo);

    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };
  
  const subtotal = cart.reduce( (acc, item) => {
    // console.log("item==>");
    // console.log(item);    
    //console.log(item.variants.edges[0].node.price);
    //console.log(item.merchandise.price.amount);
    //const price = parseFloat(item.variants.edges[0].node.price.amount);
    // return acc + price;
      
    const price = parseFloat(item?.variants?.edges?.[0]?.node?.price?.amount ?? 0);
    //const price = parseFloat(item.variants.edges[0].node.price.amount);
    // const qty = parseFloat(item.merchandise.quantity);
    const qty = parseFloat(1);
    return qty + price;          
  }, 0);
  console.log("Subtotal:", subtotal);
  console.log("Cart:", cart);

  function handleUpdateQuantity(item, newQuantity) {
    console.log("Updating quantity for item:", item);
    console.log("New quantity:", newQuantity);
    if (newQuantity < 1) return; // Prevent quantity from being less than 1 
  }
  return (
    <div>
      <div className="product-lists" id="products">
        <h1>Products</h1>
        <button onClick={() =>{ createBundles(products[0],products[1])  }}>Create Bundle combination</button>
        <ul className="product-list-ele">
          {products.map((product) => {
            if (product.images.edges[0]?.node?.src) {
              return (
                <li key={product.id}>
                  <p>{product.description}</p>

                  <img
                    src={product.images.edges[0].node.src}
                    alt={product.title}
                    style={{ width: "100px" }}
                  />

                  <Link to={`/products/${product.handle}`}>
                    <h2>{product.title}</h2>
                  </Link>

                  <div>
                    Rs. {product.variants.edges[0].node.price.amount}
                  </div>

                  <button onClick={() => handleAddToCart(product)}>
                    Add to cart
                  </button>
                </li>
              );
            }else{
              // return (
              //   <li key={product.id}>                  
              //     <Link to={`/products/${product.handle}`}>
              //       <h2>{product.title}</h2>
              //     </Link>
              //     <p>{product.description}</p>  
              //   </li>
              // );        
            }

            return null;
          })}
        </ul>
         {pageInfo?.hasNextPage && (
            <div className="pagination">

              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>

            </div>
          )}
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
                     <span>Quantity:</span> 
                      <div class="qty_box">
                        <button onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>-</button>
                        <input type="number"
                          class="input-text qty text" 
                          name="quantity" 
                          value={item.quantity} 
                          onChange={(e) => handleUpdateQuantity(item, parseInt(e.target.value))} 
                          aria-label="Product quantity" 
                          min="1" 
                          step="1" 
                          placeholder="" 
                          inputmode="numeric" 
                          autocomplete="off" 
                        />
                        <button onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>+</button>
                      </div>
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
