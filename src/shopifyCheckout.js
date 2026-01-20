const SHOPIFY_STORE_URL = 'https://rahul-dev007.myshopify.com/api/2024-01/graphql.json';
const ACCESS_TOKEN = 'c4993d7a9e4c8c8f6f5247d7426d30c8';

export const createCheckout = async (cartItems) => {
    const query = `
        mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
                cart {
                    id
                    checkoutUrl
                }
                userErrors {
                    field
                    message
                }
            }
        }`;
        
        const variables = {
            input: {
                lines: cartItems.map(item => ({
                    quantity: 1,
                    merchandiseId: item.merchandise.id,
                }))
            }
        };

        try {
            const response = await fetch(SHOPIFY_STORE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();

            if (result?.data?.cartCreate?.userErrors?.length > 0) {
                console.error("Shopify userErrors:", result.data.cartCreate.userErrors);
                alert("Error creating cart. See console.");
                return;
            }

            const checkoutUrl = result.data.cartCreate.cart.checkoutUrl;
            return checkoutUrl; //window.location.href = checkoutUrl;
        } catch (error) {
            console.error("Failed to create cart:", error);
            alert("Checkout failed.");
        }
    };    