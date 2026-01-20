import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SHOPIFY_STORE_DOMAIN = "your-store.myshopify.com";
const SHOPIFY_ACCESS_TOKEN = "your-access-token";

const fetchProductDetails = async (handle) => {
  const query = `
    {
      productByHandle(handle: "${handle}") {
        id
        title
        description
        images(first: 3) {
          edges {
            node {
              url
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data.data.productByHandle;
};

export default function ProductDetail() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductDetails(handle).then(setProduct);
  }, [handle]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>
        Price: {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
      </p>
      {product.images.edges.map((img, index) => (
        <img key={index} src={img.node.url} alt={product.title} width="200" />
      ))}
    </div>
  );
}
