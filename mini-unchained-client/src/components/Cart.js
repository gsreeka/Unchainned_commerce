import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_CART = gql`
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

const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartId: ID!, $productId: ID!, $quantity: Int!) {
    updateCartItem(cartId: $cartId, productId: $productId, quantity: $quantity) {
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
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: ID!, $productId: ID!) {
    removeFromCart(cartId: $cartId, productId: $productId) {
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
    }
  }
`;

const CHECKOUT = gql`
  mutation Checkout($cartId: ID!) {
    checkout(cartId: $cartId) {
      id
      items {
        productId
        quantity
        product {
          title
          price
        }
      }
      total
      status
      createdAt
    }
  }
`;

const Cart = ({ cartId, onClose }) => {
  const { data: cartData, loading, refetch } = useQuery(GET_CART, {
    variables: { id: cartId },
    skip: !cartId
  });

  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [checkout] = useMutation(CHECKOUT);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    try {
      await updateCartItem({
        variables: {
          cartId,
          productId,
          quantity: newQuantity
        }
      });
      refetch();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart({
        variables: {
          cartId,
          productId
        }
      });
      refetch();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout({
        variables: { cartId }
      });
      alert('Order placed successfully!');
      refetch();
      onClose();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  if (loading) return <div>Loading cart...</div>;

  const cart = cartData?.cart;
  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      background: 'white',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Cart Header */}
      <div style={{
        background: '#2E5BBA',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Shopping Cart</h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      {/* Cart Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        {isEmpty ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>Your cart is empty</p>
            <p>Add some NEMA standards to get started!</p>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '0.9rem',
                    color: '#2E5BBA'
                  }}>
                    {item.product.title}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: '#666', 
                    fontSize: '0.8rem' 
                  }}>
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    style={{
                      background: '#f8f9fa',
                      border: '1px solid #ddd',
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  
                  <span style={{ 
                    minWidth: '30px', 
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    style={{
                      background: '#f8f9fa',
                      border: '1px solid #ddd',
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                  
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: '0.5rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Cart Footer */}
      {!isEmpty && (
        <div style={{
          borderTop: '2px solid #eee',
          padding: '1rem',
          background: '#f8f9fa'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <strong>Total: ${cart?.total?.toFixed(2) || '0.00'}</strong>
          </div>
          
          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              background: '#2E5BBA',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
