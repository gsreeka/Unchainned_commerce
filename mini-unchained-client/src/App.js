import React, { useState, useEffect } from "react";
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  gql 
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useQuery, useMutation } from "@apollo/client/react";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// GraphQL queries and mutations
const GET_PRODUCTS = gql`
  query {
    products {
      id
      title
      description
      price
    }
  }
`;

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

const CREATE_CART = gql`
  mutation {
    createCart {
      id
      items {
        productId
        quantity
      }
      status
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($cartId: ID!, $productId: ID!, $quantity: Int!) {
    addToCart(cartId: $cartId, productId: $productId, quantity: $quantity) {
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
      }
      total
      status
      createdAt
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

const CLEAR_CART = gql`
  mutation ClearCart($cartId: ID!) {
    clearCart(cartId: $cartId) {
      id
      items {
        productId
        quantity
      }
      total
    }
  }
`;

function Header() {
  return (
    <header style={{
      backgroundColor: '#2E5BBA',
      color: 'white',
      padding: '0.75rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/image.png" 
              alt="NEMA Logo" 
              style={{ 
                height: '40px',
                marginRight: '1rem'
              }}
            />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                The National Electrical Manufacturers Association
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Powered by Accuris
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.8rem' }}>
            <span>Store Home</span>
            <span>|</span>
            <span>Help & Support</span>
            <span>|</span>
            <span>Sign In</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              SHOP by Category ▼
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Search NEMA"
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '4px 0 0 4px',
                  width: '300px',
                  fontSize: '0.9rem'
                }}
              />
              <select style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: 'white',
                fontSize: '0.9rem'
              }}>
                <option>NEMA Catalog</option>
              </select>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1a365d',
                color: 'white',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer'
              }}>
                🔍
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.9rem' }}>MY ACCOUNT ▼</div>
            <div style={{ fontSize: '1.2rem' }}>🛒</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ProductsList({ cartId, onAddToCart }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading NEMA standards...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: '#e53e3e' }}>Error: {error.message}</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '1rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ 
          backgroundColor: '#2E5BBA', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          marginBottom: '1rem',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          PRODUCTS
        </div>
        
        <div style={{ 
          display: 'grid', 
          gap: '1rem', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          padding: '1rem 0'
        }}>
          {data.products.map((product) => (
            <div key={product.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                height: '160px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e9ecef',
                position: 'relative'
              }}>
                <div style={{
                  width: '120px',
                  height: '140px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  color: '#666',
                  textAlign: 'center',
                  padding: '0.5rem'
                }}>
                  <div style={{ 
                    backgroundColor: '#2E5BBA', 
                    color: 'white', 
                    padding: '0.25rem', 
                    marginBottom: '0.5rem',
                    fontSize: '0.6rem',
                    fontWeight: 'bold'
                  }}>
                    NEMA
                  </div>
                  <div style={{ fontSize: '0.6rem', lineHeight: '1.2' }}>
                    {product.title.split(' ').slice(0, 3).join(' ')}
                  </div>
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '0.5rem', 
                    fontSize: '0.5rem',
                    color: '#999'
                  }}>
                    Standard Document
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '1rem' }}>
                <h3 style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  color: '#2E5BBA', 
                  marginBottom: '0.5rem',
                  lineHeight: '1.3'
                }}>
                  {product.title}
                </h3>
                
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.8rem', 
                  marginBottom: '1rem',
                  lineHeight: '1.3',
                  height: '2.6rem',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px solid #eee',
                  paddingTop: '0.75rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666' }}>PRICED FROM</div>
                    <span style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                      color: '#2E5BBA' 
                    }}>
                      ${product.price}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => onAddToCart(product.id)}
                    style={{
                      backgroundColor: '#2E5BBA',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2E5BBA'}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cart({ cartId, onCheckout, onRemoveItem, onUpdateQuantity, onClearCart }) {
  const { loading, error, data } = useQuery(GET_CART, {
    variables: { id: cartId },
    skip: !cartId
  });

  if (!cartId) {
    return (
      <div style={{ 
        backgroundColor: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        margin: '1rem auto'
      }}>
        <div style={{ 
          backgroundColor: '#2E5BBA', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          SHOPPING CART
        </div>
        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          <p>Your cart is empty. Add some NEMA standards to get started!</p>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading cart...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: '#e53e3e' }}>Error: {error.message}</div>;

  const cart = data.cart;
  
  return (
    <div style={{ 
      backgroundColor: 'white', 
      border: '1px solid #ddd', 
      borderRadius: '4px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '1rem auto'
    }}>
      <div style={{ 
        backgroundColor: '#2E5BBA', 
        color: 'white', 
        padding: '0.5rem 1rem', 
        fontSize: '1rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>SHOPPING CART ({cart.items.length} items)</span>
        {cart.items.length > 0 && (
          <button 
            onClick={() => onClearCart(cartId)}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '3px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.7rem',
              cursor: 'pointer'
            }}
            title="Clear all items"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div style={{ padding: '1rem' }}>
        {cart.items.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>
            Your cart is empty
          </p>
        ) : (
          <>
            <div style={{ marginBottom: '1rem' }}>
              {cart.items.map((item) => (
                <div key={item.product.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ flex: 1, marginRight: '1rem' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#2E5BBA', 
                      fontSize: '0.8rem',
                      lineHeight: '1.3',
                      marginBottom: '0.25rem'
                    }}>
                      {item.product.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.5rem' }}>
                      ${item.product.price} each
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => onUpdateQuantity(cartId, item.product.id, item.quantity - 1)}
                        style={{
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 1;
                          onUpdateQuantity(cartId, item.product.id, newQty);
                        }}
                        style={{
                          width: '50px',
                          padding: '0.25rem',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          textAlign: 'center',
                          fontSize: '0.8rem'
                        }}
                        min="1"
                      />
                      
                      <button 
                        onClick={() => onUpdateQuantity(cartId, item.product.id, item.quantity + 1)}
                        style={{
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        +
                      </button>
                      
                      <button 
                        onClick={() => onRemoveItem(cartId, item.product.id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          marginLeft: '0.5rem'
                        }}
                        title="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: '#2E5BBA', fontWeight: '600' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              borderTop: '2px solid #2E5BBA', 
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2E5BBA' }}>
                Total: ${cart.total.toFixed(2)}
              </div>
              <button 
                onClick={() => onCheckout(cartId)}
                style={{
                  backgroundColor: '#2E5BBA',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2E5BBA'}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OrderConfirmation({ order, onContinueShopping }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      border: '1px solid #ddd', 
      borderRadius: '4px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '2rem auto',
      textAlign: 'center'
    }}>
      <div style={{ 
        backgroundColor: '#28a745', 
        color: 'white', 
        padding: '1rem', 
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        ✅ ORDER CONFIRMED
      </div>
      
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#2E5BBA', marginBottom: '0.5rem' }}>
            Thank you for your order!
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Your NEMA standards have been processed successfully.
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Order ID:</strong> {order.id}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Status:</strong> {order.status}
          </div>
          <div>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <button 
          onClick={onContinueShopping}
          style={{
            backgroundColor: '#2E5BBA',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

function StoreApp() {
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

export default function App() {
  return (
    <ApolloProvider client={client}>
      <StoreApp />
    </ApolloProvider>
  );
}
