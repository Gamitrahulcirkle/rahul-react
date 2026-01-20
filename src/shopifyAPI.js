import axios from "axios";

const SHOPIFY_STORE_URL =
  "https://rahul-dev007.myshopify.com/api/2023-10/graphql.json";
const ACCESS_TOKEN = "c4993d7a9e4c8c8f6f5247d7426d30c8";

export const fetchProducts = async () => {
  const query = `
    {
      products(first: 40) {
        edges {
          node {
            id
            handle
            title            
            description
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }  
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      SHOPIFY_STORE_URL,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
        },
      }
    );
    return response.data.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductByHandle = async (handle) => {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        priceRange {
          maxVariantPrice{
              amount
              currencyCode
            }
          minVariantPrice {
            amount
            currencyCode
          }
        }
        description
        handle
        images(first: 1) {
          edges {
            node {
              src
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const variables = { handle };

  try {
    const response = await fetch(SHOPIFY_STORE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    console.log("Product detail based on handle..");
    console.log(json);
    return json.data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const metaobjectSliderImage = async () => {
  // const query = `
  //   query GetBannerSliderMetaobject {
  //     metaobject(
  //       handle: {
  //         type: "banner_slider"
  //         handle: "banner-slider-rdimhnjg"
  //       }
  //     ) {
  //         id
  //         fields {
  //           key
  //           value
  //           references(first: 10) {
  //             nodes {
  //               ... on MediaImage {
  //               image {
  //                 url
  //                 altText
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }`;
  const query = `
    query GetBannerSliderMetaobject {
      metaobject(
        handle: {
          type: "slider_group"
          handle: "slider-group-lpc577ra"
        }
      ) {
        id
        fields {
          key
          value
          references(first: 10) {
            nodes {              
              ... on Metaobject {
                id
                fields {
                  key
                  value                  
                  reference {
                    ... on MediaImage {
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

  try {
    const response = await fetch(SHOPIFY_STORE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    const imageField = json.data.metaobject.fields.find(
      (field) => field.key === "new_slides"
    );
    return (
      imageField?.references?.nodes.map((node, index) => ({
        data: node.fields,
      })) || []
    );
    // return (
    //   imageField?.references?.nodes.map((node, index) => ({
    //     id: index,
    //     src: node.image.url,
    //     alt: node.image.altText || "Banner image",
    //   })) || []
    // );
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addToCart = async (cartId, variantId) => {
  const ADD_TO_CART_MUTATION = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first: 1) {
                      nodes {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

  const res = await fetch(SHOPIFY_STORE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: ADD_TO_CART_MUTATION,
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      },
    }),
  });

  const json = await res.json();
  console.log(json);
  return json.data.cartLinesAdd.cart.lines.nodes;
};

export const createCart = async () => {
  const CREATE_CART_MUTATION = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }`;

  const createCart = await fetch(SHOPIFY_STORE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: CREATE_CART_MUTATION }),
  });

  const data = await createCart.json();
  return data.data.cartCreate.cart.id;
};

export const fetchCartData = async (cartId) => {
  const FETCH_CART_QUERY = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 20) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  images(first: 1) {
                    nodes {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

    const resCart = await fetch(SHOPIFY_STORE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: FETCH_CART_QUERY,
        variables: { cartId },
      }),
    });
    const data = await resCart.json();
    console.log("data===>");
    console.log(data);
    //return data.data.cart;
  };

  