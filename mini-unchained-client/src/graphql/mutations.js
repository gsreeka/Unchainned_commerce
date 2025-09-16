import { gql } from "@apollo/client";

export const CREATE_CART = gql`
  mutation { createCart { id items { productId quantity } status } }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartId: ID!, $productId: ID!, $quantity: Int!) {
    addToCart(cartId: $cartId, productId: $productId, quantity: $quantity) {
      id
      items { productId quantity product { id title price } }
      total
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: ID!, $productId: ID!) {
    removeFromCart(cartId: $cartId, productId: $productId) {
      id
      items { productId quantity product { id title price } }
      total
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartId: ID!, $productId: ID!, $quantity: Int!) {
    updateCartItem(cartId: $cartId, productId: $productId, quantity: $quantity) {
      id
      items { productId quantity product { id title price } }
      total
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($cartId: ID!) {
    clearCart(cartId: $cartId) {
      id
      items { productId quantity }
      total
    }
  }
`;

export const CHECKOUT = gql`
  mutation Checkout($cartId: ID!) {
    checkout(cartId: $cartId) {
      id
      items { productId quantity }
      total
      status
      createdAt
    }
  }
`;
