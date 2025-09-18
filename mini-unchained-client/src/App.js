import React, { useState, useEffect } from "react";
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  gql 
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useQuery, useMutation } from "@apollo/client/react";
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import Notification from './components/Notification';

const httpLink = createHttpLink({
  uri: "http://localhost:4001",
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
      doc_number
      title
      short_title
      series
      part
      revision
      status
      description
      publisher
      publication_year
      languages
      access {
        type
        price_usd
        sku
      }
      multi_user
      categories
      tags
      url
      created_at
      updated_at
      metadata {
        document_type
        format_support
        is_replaced
      }
      price
    }
  }
`;

const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
      slug
      description
      parent_id
      sort_order
      created_at
      updated_at
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

const MainApp = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const [addToCart] = useMutation(ADD_TO_CART);
  const [createCart] = useMutation(CREATE_CART);
  const [checkout] = useMutation(CHECKOUT);
  
  const [cartId, setCartId] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notification, setNotification] = useState(null);
  const [order, setOrder] = useState(null);

  // Create a cart when the component mounts
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

  const handleProductClick = (product) => {
    console.log('handleProductClick called with:', product);
    setSelectedProduct(product);
    setShowProductDetail(true);
    console.log('Modal state set to true');
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory 
    ? data?.products?.filter(product => 
        product.categories && product.categories.includes(parseInt(selectedCategory))
      ) || []
    : data?.products || [];

  console.log('Filtered products:', filteredProducts, 'selectedCategory:', selectedCategory);
  console.log('All products with categories:', data?.products?.map(p => ({id: p.id, title: p.title, categories: p.categories})));
  console.log('Categories data:', categoriesData?.categories?.map(c => ({id: c.id, name: c.name})));

  const handleAddToCart = async (productId) => {
    if (!cartId) {
      console.log('No cart ID available');
      return;
    }
    
    try {
      const result = await addToCart({
        variables: {
          cartId: cartId,
          productId: productId,
          quantity: 1
        }
      });
      
      console.log('Add to cart result:', result);
      
      setNotification({
        message: 'Product added to cart!',
        type: 'success'
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification({
        message: 'Error adding item to cart: ' + error.message,
        type: 'error'
      });
    }
  };

  const handleCheckout = async () => {
    if (!cartId) return;
    
    try {
      const result = await checkout({
        variables: { cartId }
      });
      setOrder(result.data.checkout);
      
      // Create a new cart for future shopping
      const newCartResult = await createCart();
      setCartId(newCartResult.data.createCart.id);
      setShowCart(false);
    } catch (error) {
      console.error('Error during checkout:', error);
      setNotification({
        message: 'Checkout failed: ' + error.message,
        type: 'error'
      });
    }
  };

  console.log('MainApp render - loading:', loading, 'error:', error, 'data:', data, 'categoriesData:', categoriesData);
  
  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error.message}</div>;

  if (showAdmin) {
    return (
      <div>
        <div style={{ 
          background: '#2E5BBA', 
          color: 'white', 
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0 }}>NEMA Admin Panel</h1>
          <button
            onClick={() => setShowAdmin(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Store
          </button>
        </div>
        <AdminPanel />
      </div>
    );
  }

  if (order) {
    return (
      <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
        <Header onShowAdmin={() => setShowAdmin(true)} />
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
            ORDER CONFIRMED
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
              onClick={() => setOrder(null)}
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
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <Header 
        onShowAdmin={() => setShowAdmin(true)} 
        onShowCart={() => setShowCart(true)}
        categories={categoriesData?.categories || []}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <ProductsList 
          products={filteredProducts} 
          onAddToCart={handleAddToCart} 
          onProductClick={handleProductClick}
        />
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <Cart
          cartId={cartId}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={showProductDetail}
          onClose={handleCloseProductDetail}
        />
      )}
    </div>
  );
};

// Header Component
function Header({ onShowAdmin, onShowCart, categories, selectedCategory, onCategoryChange }) {
  return (
    <header>
      {/* Top Blue Section */}
      <div style={{
        backgroundColor: '#2E5BBA',
        color: 'white',
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side - NEMA Logo and Text */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/image.png" 
                alt="NEMA Logo" 
                style={{ 
                  height: '50px',
                  width: 'auto',
                  marginRight: '1rem'
                }}
              />
              <div>
                <div style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  lineHeight: '1.1'
                }}>
                  The National Electrical Manufacturers
                </div>
                <div style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  lineHeight: '1.1'
                }}>
                  Association
                </div>
                
              </div>
            </div>
            
            {/* Right side - Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem' }}>
              <button
                onClick={onShowAdmin}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Admin Panel
              </button>
              <span>Store Home</span>
              <span style={{ opacity: 0.7 }}>|</span>
              <span>Help & Support</span>
              <span style={{ opacity: 0.7 }}>|</span>
              <span>Sign In</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gray Section */}
      <div style={{
        backgroundColor: '#e5e7eb',
        padding: '0.75rem 0',
        borderBottom: '1px solid #d1d5db'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side - Shop and Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select 
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                style={{ 
                  backgroundColor: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  outline: 'none',
                  minWidth: '160px'
                }}>
                <option value="">SHOP by Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                overflow: 'hidden',
                minWidth: '400px'
              }}>
                <input 
                  type="text" 
                  placeholder="Search NEMA"
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '0.6rem 1rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: '#374151'
                  }}
                />
                <button style={{
                  background: '#2E5BBA',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  🔍
                </button>
              </div>
            </div>
            
            {/* Right side - Account and Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                background: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                border: '1px solid #d1d5db',
                fontWeight: '600',
                color: '#374151'
              }}>
                MY ACCOUNT ▼
              </div>
              <button
                onClick={onShowCart}
                style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                🛒 -
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Products List Component
function ProductsList({ products, onAddToCart, onProductClick }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem 0' }}>
      <div style={{ 
        background: '#2E5BBA', 
        color: 'white', 
        padding: '0.75rem 1.5rem', 
        marginBottom: '2rem',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        letterSpacing: '0.5px'
      }}>
        MOST POPULAR PRODUCTS
      </div>
      
      <div style={{ 
        display: 'grid', 
        gap: '1.5rem', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        padding: '2rem 0',
        justifyItems: 'center'
      }}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => onAddToCart(product.id)} 
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <MainApp />
    </ApolloProvider>
  );
}
