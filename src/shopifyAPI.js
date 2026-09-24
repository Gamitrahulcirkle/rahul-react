import { parseJSON } from "@shopify/hydrogen-react/parse-metafield";
import axios from "axios";

const SHOPIFY_STORE_URL ="https://rahul-dev007.myshopify.com/api/2023-10/graphql.json";
const SHOPIFY_ADMIN_URL = "https://rahul-dev007.myshopify.com/admin/api/2024-01/graphql.json";
// const ACCESS_TOKEN = "c4993d7a9e4c8c8f6f5247d7426d30c8";
const ACCESS_TOKEN = "ef83e9718466d26199bb0ae32437e2b5";

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
    // const variables = {
    //   first: Number(first),
    //   after: after === null ? null : String(after),
    // };

    const productData = await axios.post(
      SHOPIFY_STORE_URL,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
        },
      }
    );
    return productData.data.data.products.edges.map((edge) => edge.node);
   // return productData.data;

  //  console.log("START CURSOR:", productData);
    //console.log("END CURSOR:", productData.data.data.products.pageInfo.endCursor);
    //return {
      //products: productData.data.data.products.edges.map((edge) => edge.node),
      //pageInfo: productData.data.data.products.pageInfo,
    //};
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
        metafields(identifiers: [
          { namespace: "custom", key: "short_description" },
          { namespace: "custom", key: "related_products" }
        ]) {
          id
          namespace
          key
          value
          type
        }
      }
    }
  `;

// export const fetchProductByHandle = async (handle) => {
//   const query = `
//     query getProductByHandle($handle: String!) {
//       product(handle: $handle) {
//         id
//         title
//         description
//         handle

//         priceRange {
//           maxVariantPrice {
//             amount
//             currencyCode
//           }
//           minVariantPrice {
//             amount
//             currencyCode
//           }
//         }

//         images(first: 1) {
//           edges {
//             node {
//               url
//             }
//           }
//         }

//         variants(first: 1) {
//           edges {
//             node {
//               id
//               title
//               price {
//                 amount
//                 currencyCode
//               }
//               compareAtPrice {
//                 amount
//                 currencyCode
//               }
//             }
//           }
//         }
       
//       }
//     }
//   `;

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

    const product = json.data.product;

  const sanitizedMetafields = product.metafields.map((field) => {
    let parsedValue = JSON.parse(field.value);
    //console.log(JSON.parse(parsedValue));

    try {
      // Only parse JSON-based metafields
      if ( field.type.includes("list") || field.type.includes("json")) {
        parsedValue = JSON.parse(field.value);
      }
    } catch (error) {
      console.error("Failed to parse metafield:", field.key);
    }    
    return {
      ...field,
      value: parsedValue,
    };
  });
//console.log(sanitizedMetafields);
    return { ...json.data.product, metafields: sanitizedMetafields };
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
  localStorage.setItem('cartID', data.data.cartCreate.cart.id);
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
    return data.cartLinesAdd;
  };


  export const createProductBundle = (p1, p2) =>{
  
//return [p1, p2];

  //const SHOPIFY_STORE = 'your-store.myshopify.com';
  //const ACCESS_TOKEN = 'your-access-token';
  const API_VERSION = '2025-01';

  async function createVariantFixedBundle() {
    // Step 1: Create the bundle product
    const createProductMutation = `
      mutation CreateBundleProduct($input: ProductCreateInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  const productInput = {
    input: {
      title: "Summer Beach Bundle",
      productType: "Bundle",
      vendor: "My Store",
      productOptions: [{ name: "Title" }],
      variants: [
        {
          price: "49.99",
          inventoryPolicy: "CONTINUE",
          optionValues: [
            {
              optionName: "Title",
              name: "Default Title"
            }
          ]
        }
      ]
    }
  };

  let response = await fetch(SHOPIFY_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN
    },
    body: JSON.stringify({
      query: createProductMutation,
      variables: productInput
    })
  });

  let data = await response.json();
  console.log("data ==>");
  console.log(data);
  const bundleVariantId = data.data.productCreate.product.variants.edges[0].node.id;
  console.log('Bundle Variant ID:', bundleVariantId);

  // Step 2: Add components to the bundle
  const addComponentsMutation = `
    mutation CreateBundle($input: [ProductVariantRelationshipUpdateInput!]!) {
      productVariantRelationshipBulkUpdate(input: $input) {
        parentProductVariants {
          id
          productVariantComponents(first: 10) {
            nodes {
              id
              quantity
              productVariant {
                id
                displayName
              }
            }
          }
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const componentsInput = {
    input: [
      {
        parentProductVariantId: bundleVariantId,
        productVariantRelationshipsToCreate: [
          {
            productVariantId: `gid://shopify/ProductVariant/${p1[0].id}`,
            quantity: 1
          },
          {
            productVariantId: `gid://shopify/ProductVariant/${p1[0].id}`,
            quantity: 2
          }
        ]
      }
    ]
  };

  response = await fetch(SHOPIFY_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN
      // 'X-Shopify-Access-Token': ACCESS_TOKEN
    },
    body: JSON.stringify({
      query: addComponentsMutation,
      variables: componentsInput
    })
  });

  data = await response.json();
  console.log('Bundle created:', JSON.stringify(data, null, 2));
}

createVariantFixedBundle();

  }

  