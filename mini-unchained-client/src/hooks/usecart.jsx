import { useMutation, useQuery, gql } from "@apollo/client";
import React, { useState, useEffect } from "react";  // ✅ only React hooks here

import {
  CREATE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
  CHECKOUT
} from "../graphql/mutations";

export default function useCart() {
  const [cartId, setCartId] = useState(null);
  const [order, setOrder] = useState(null);

  const [createCart] = useMutation(CREATE_CART);
  const [addToCart] = useMutation(ADD_TO_CART);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [clearCart] = useMutation(CLEAR_CART);
  const [checkout] = useMutation(CHECKOUT);

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      try {
        const result = await createCart();
        setCartId(result.data.createCart.id);
      } catch (error) {
        console.error("Error creating cart:", error);
      }
    };
    initCart();
  }, [createCart]);

  const handleAddToCart = async (productId) => {
    if (!cartId) return;
    try {
      await addToCart({
        variables: { cartId, productId, quantity: 1 },
        refetchQueries: ["GetCart"]
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart({
        variables: { cartId, productId },
        refetchQueries: ["GetCart"]
      });
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart");
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem({
        variables: { cartId, productId, quantity },
        refetchQueries: ["GetCart"]
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update item quantity");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear all items?")) {
      try {
        await clearCart({ variables: { cartId }, refetchQueries: ["GetCart"] });
      } catch (error) {
        console.error("Error clearing cart:", error);
        alert("Failed to clear cart");
      }
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await checkout({ variables: { cartId } });
      setOrder(result.data.checkout);

      // Create a new cart for future shopping
      const newCartResult = await createCart();
      setCartId(newCartResult.data.createCart.id);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed: " + error.message);
    }
  };

  const handleContinueShopping = () => setOrder(null);

  return {
    cartId,
    order,
    handleAddToCart,
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
    handleCheckout,
    handleContinueShopping
  };
}
