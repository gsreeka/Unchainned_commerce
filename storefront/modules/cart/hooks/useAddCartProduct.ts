import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { LOGIN_AS_GUEST_MUTATION } from '../../auth/hooks/useLoginAsGuest';
import useUser from '../../auth/hooks/useUser';
 
export const ADD_CART_PRODUCT_MUTATION = gql`
  mutation AddCartProduct(
    $productId: ID!
    $quantity: Int
    $configuration: [ProductConfigurationParameterInput!]
  ) {
    addCartProduct(
      productId: $productId
      quantity: $quantity
      configuration: $configuration
    ) {
      _id
      order {
        _id
        items {
          _id
          quantity
          total {
            amount
            currencyCode
          }
          unitPrice {
            amount
            currencyCode
          }
        }
        itemsTotal: total(category: ITEMS) {
          amount
          currencyCode
        }
        taxes: total(category: TAXES) {
          amount
          currencyCode
        }
        delivery: total(category: DELIVERY) {
          amount
          currencyCode
        }
        payment: total(category: PAYMENT) {
          amount
          currencyCode
        }
        total {
          amount
          currencyCode
        }
        user {
          _id
          cart {
            _id
          }
        }
      }
    }
  }
`;
 
const useAddCartProduct = () => {
  const [addCartProductMutation, { client, ...mutationResults }] =
    useMutation<any>(ADD_CART_PRODUCT_MUTATION);
  const { user } = useUser();
  const [loginAsGuestMutation] = useMutation<any>(LOGIN_AS_GUEST_MUTATION);
 
  const addCartProduct = async ({
    productId,
    quantity = 1,
    configuration = [],
  }: {
    productId: string;
    quantity?: number;
    configuration?: Array<{ key: string; value: string }>;
  }) => {
    try {
      if (!user) {
        const { data } = await loginAsGuestMutation();
        if (data?.loginAsGuest) {
          // Wait for the user to be logged in
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
 
      const result = await addCartProductMutation({
        variables: {
          productId,
          quantity,
          configuration,
        },
        update: (cache, { data: { addCartProduct } }) => {
          // Update the cache with the new cart data
          cache.modify({
            id: cache.identify({
              __typename: 'User',
              _id: user?._id,
            }),
            fields: {
              cart: () => addCartProduct,
            },
          });
        },
      });
 
      return result;
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      if (err.message.toLowerCase().includes('not enough in stock')) {
        alert('Out of stock');
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
      throw err;
    }
  };
 
  return [addCartProduct, mutationResults];
};
export default useAddCartProduct;