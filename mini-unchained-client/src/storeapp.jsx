import Header from "./components/header/header";
import ProductsList from "./components/productlist/productlist";
import Cart from "./components/cart/cart";
import OrderConfirmation from "./components/orderconfirmation/orderconfirmation";
import { useState, useEffect } from "react";
import { GET_CART } from "./graphql/queries";
import { CREATE_CART, ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM, CLEAR_CART, CHECKOUT } from "./graphql/mutations";
import { useMutation } from "@apollo/client/react";



export default function StoreApp() {
  const [cartId, setCartId] = useState(null);
  const [order, setOrder] = useState(null);
  const [createCart] = useMutation(CREATE_CART);
  const [addToCart] = useMutation(ADD_TO_CART);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [clearCart] = useMutation(CLEAR_CART);
  const [checkout] = useMutation(CHECKOUT);

  // Create cart on component mount
  useEffect(() => {
    if (!createCart) return;

    const initCart = async () => {
      try {
        const result = await createCart();
        setCartId(result.data.createCart.id);
      } catch (error) {
        console.error('Error creating cart:', error);
      }
    };
    initCart();
  }, [createCart]);

  const handleAddToCart = async (productId) => {
    if (!cartId || !addToCart) return;

    try {
      await addToCart({
        variables: {
          cartId,
          productId,
          quantity: 1
        },
        refetchQueries: [{ query: GET_CART, variables: { id: cartId } }]
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleRemoveItem = async (cartId, productId) => {
    if (!removeFromCart) return;

    try {
      await removeFromCart({
        variables: { cartId, productId },
        refetchQueries: [{ query: GET_CART, variables: { id: cartId } }]
      });
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
    }
  };

  const handleUpdateQuantity = async (cartId, productId, quantity) => {
    if (!updateCartItem) return;

    try {
      await updateCartItem({
        variables: { cartId, productId, quantity },
        refetchQueries: [{ query: GET_CART, variables: { id: cartId } }]
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update item quantity');
    }
  };

  const handleClearCart = async (cartId) => {
    if (!clearCart) return;

    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      try {
        await clearCart({
          variables: { cartId },
          refetchQueries: [{ query: GET_CART, variables: { id: cartId } }]
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart');
      }
    }
  };

  const handleCheckout = async (cartId) => {
    if (!checkout) return;

    try {
      const result = await checkout({
        variables: { cartId }
      });
      setOrder(result.data.checkout);

      // Create a new cart for future shopping
      const newCartResult = await createCart();
      setCartId(newCartResult.data.createCart.id);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed: ' + error.message);
    }
  };

  const handleContinueShopping = () => {
    setOrder(null);
  };

  if (order) {
    return (
      <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
        <Header />
        <OrderConfirmation order={order} onContinueShopping={handleContinueShopping} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <ProductsList cartId={cartId} onAddToCart={handleAddToCart} />
        <Cart
          cartId={cartId}
          onCheckout={handleCheckout}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}