import React, { useState, useEffect } from "react";
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  gql 
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useQuery, useMutation } from "@apollo/client/react";
import AdminPanel from './components/AdminPanel/AdminPanel';
import Cart from './components/Cart/Cart';
import ProductCard from './components/ProductCard/ProductCard';
import ProductDetailModal from './components/ProductDetailModal/ProductDetailModal';
import Notification from './components/Notification/Notification';
import './App.css';

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
  
  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error.message}</div>;

  if (showAdmin) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">NEMA Admin Panel</h1>
          <button
            onClick={() => setShowAdmin(false)}
            className="admin-back-btn"
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
      <div className="app-container">
        <Header onShowAdmin={() => setShowAdmin(true)} />
        <div className="order-container">
          <div className="order-header">
            ORDER CONFIRMED
          </div>
          
          <div className="order-content">
            <div className="order-thank-you">
              <h3 className="order-title">
                Thank you for your order!
              </h3>
              <p className="order-subtitle">
                Your NEMA standards have been processed successfully.
              </p>
            </div>
            
            <div className="order-details">
              <div className="order-detail-item">
                <strong>Order ID:</strong> {order.id}
              </div>
              <div className="order-detail-item">
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </div>
              <div className="order-detail-item">
                <strong>Status:</strong> {order.status}
              </div>
              <div className="order-detail-item">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <button 
              onClick={() => setOrder(null)}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        onShowAdmin={() => setShowAdmin(true)} 
        onShowCart={() => setShowCart(true)}
        categories={categoriesData?.categories || []}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <div className="main-content">
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
      <div className="header-top">
        <div className="header-top-content">
          {/* Left side - NEMA Logo and Text */}
          <div className="header-left">
            <img 
              src="/image.png" 
              alt="NEMA Logo" 
              className="nema-logo"
            />
            <div>
              <div className="nema-text">
                The National Electrical Manufacturers
              </div>
              <div className="nema-text">
                Association
              </div>
            </div>
          </div>
          
          {/* Right side - Navigation */}
          <div className="header-nav">
            <button
              onClick={onShowAdmin}
              className="admin-panel-btn"
            >
              Admin Panel
            </button>
            <span>Store Home</span>
            <span className="nav-separator">|</span>
            <span>Help & Support</span>
            <span className="nav-separator">|</span>
            <span>Sign In</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Gray Section */}
      <div className="header-bottom">
        <div className="header-bottom-content">
          {/* Left side - Shop and Search */}
          <div className="header-left-controls">
            <select 
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="category-select"
            >
              <option value="">SHOP by Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search NEMA"
                className="search-input"
              />
              <button className="search-btn">
                🔍
              </button>
            </div>
          </div>
          
          {/* Right side - Account and Cart */}
          <div className="header-right-controls">
            <div className="my-account-btn">
              MY ACCOUNT ▼
            </div>
            <button
              onClick={onShowCart}
              className="cart-btn"
            >
              🛒 -
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Products List Component
function ProductsList({ products, onAddToCart, onProductClick }) {
  return (
    <div className="products-container">
      <div className="products-header">
        MOST POPULAR PRODUCTS
      </div>
      
      <div className="products-grid">
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
