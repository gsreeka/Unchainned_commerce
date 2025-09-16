import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      title
      description
      price
    }
  }
`;

export const GET_CART = gql`
  query GetCart($id: ID!) {
    cart(id: $id) {
      id
      items {
        productId
        quantity
        product {
          id
          title
          price
        }
      }
      total
      status
    }
  }
`;
