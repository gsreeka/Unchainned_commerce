# NEMA Store - E-commerce Platform
##  Features

- **Product Catalog**: Browse and search NEMA standards and documents
- **Shopping Cart**: Add products to cart with quantity management
- **Category Filtering**: Filter products by categories
- **Product Details**: Detailed modal view for each product
- **Admin Panel**: Manage products and orders (Categories tab removed for security)
- **Order Management**: Complete checkout process with order confirmation

## 🏗️ Architecture

### Frontend (React)
- **React 18** with functional components and hooks
- **Apollo Client** for GraphQL data management
- **Component-based architecture** with separated CSS files
- **Responsive design** with mobile-first approach

### Backend (Node.js)
- **Apollo Server** for GraphQL API
- **In-memory database** for development
- **Real-time data** with GraphQL queries and mutations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0 or yarn >= 1.22.0

### 1. Clone the Repository
```bash
git clone <repository-url>
cd unchainned
```

### 2. Backend Setup
```bash
cd mini-unchained-server
npm install apollo-server graphql uuid
npm start
```

The GraphQL server will start on `http://localhost:4001`

### 3. Frontend Setup
```bash
cd mini-unchained-client
npm install
npm start
```
The React app will start on `http://localhost:3000`

##  Configuration
### GraphQL Endpoint
The frontend connects to the GraphQL server at `http://localhost:4001`

## 📊 Available Scripts

### Backend
```bash
npm start          # Start the GraphQL server
npm run dev        # Start with nodemon (if configured)
```

### Frontend
```bash
npm start          # Start development server
```

## 🔄 GraphQL Schema

### Key Queries
```graphql
# Get all products
query GetProducts {
  products {
    id
    title
    price
    categories
    # ... other fields
  }
}

# Get cart
query GetCart($id: ID!) {
  cart(id: $id) {
    id
    items {
      productId
      quantity
    }
    total
  }
}
```

### Key Mutations
```graphql
# Add to cart
mutation AddToCart($cartId: ID!, $productId: ID!, $quantity: Int!) {
  addToCart(cartId: $cartId, productId: $productId, quantity: $quantity) {
    id
    total
  }
}

# Create product (Admin)
mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    title
    price
  }
}
```




