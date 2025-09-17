# NEMA Webstore CRUD Operations Guide

This guide demonstrates all the CRUD (Create, Read, Update, Delete) operations available in the NEMA webstore GraphQL API.

## Server Information
- **GraphQL Endpoint**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000 (for testing)
- **Database**: Azure Cosmos DB Emulator

## Available CRUD Operations

### 1. Product CRUD Operations

#### Create Product
```graphql
mutation CreateProduct {
  createProduct(input: {
    title: "ANSI/NEMA C12.20-2015"
    description: "American National Standard for Electricity Meters - 0.1 and 0.2 Accuracy Classes"
    price: 125.00
  }) {
    id
    title
    description
    price
  }
}
```

#### Read Products
```graphql
# Get all products
query GetAllProducts {
  products {
    id
    title
    description
    price
  }
}

# Get single product by ID
query GetProduct {
  product(id: "PRODUCT_ID_HERE") {
    id
    title
    description
    price
  }
}
```

#### Update Product
```graphql
mutation UpdateProduct {
  updateProduct(id: "PRODUCT_ID_HERE", input: {
    title: "Updated Product Title"
    price: 150.00
  }) {
    id
    title
    description
    price
  }
}
```

#### Delete Product
```graphql
mutation DeleteProduct {
  deleteProduct(id: "PRODUCT_ID_HERE")
}
```

### 2. Cart CRUD Operations

#### Create Cart
```graphql
mutation CreateCart {
  createCart {
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
  }
}
```

#### Read Carts
```graphql
# Get all carts
query GetAllCarts {
  carts {
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
  }
}

# Get single cart by ID
query GetCart {
  cart(id: "CART_ID_HERE") {
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
  }
}
```

#### Update Cart (Add/Remove/Update Items)
```graphql
# Add item to cart
mutation AddToCart {
  addToCart(cartId: "CART_ID_HERE", productId: "PRODUCT_ID_HERE", quantity: 2) {
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
  }
}

# Update cart item quantity
mutation UpdateCartItem {
  updateCartItem(cartId: "CART_ID_HERE", productId: "PRODUCT_ID_HERE", quantity: 5) {
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
  }
}

# Remove item from cart
mutation RemoveFromCart {
  removeFromCart(cartId: "CART_ID_HERE", productId: "PRODUCT_ID_HERE") {
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
  }
}

# Clear all items from cart
mutation ClearCart {
  clearCart(cartId: "CART_ID_HERE") {
    id
    items {
      productId
      quantity
    }
    total
    status
  }
}
```

#### Delete Cart
```graphql
mutation DeleteCart {
  deleteCart(cartId: "CART_ID_HERE")
}
```

### 3. Order CRUD Operations

#### Create Order (Checkout)
```graphql
mutation Checkout {
  checkout(cartId: "CART_ID_HERE") {
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
```

#### Read Orders
```graphql
# Get all orders
query GetAllOrders {
  orders {
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

# Get single order by ID
query GetOrder {
  order(id: "ORDER_ID_HERE") {
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
```

#### Update Order
```graphql
mutation UpdateOrder {
  updateOrder(id: "ORDER_ID_HERE", input: {
    status: "shipped"
  }) {
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
```

#### Delete Order
```graphql
mutation DeleteOrder {
  deleteOrder(id: "ORDER_ID_HERE")
}
```

## Testing Workflow

### 1. Basic Product Management
1. Create a new product using `createProduct`
2. List all products using `products` query
3. Get specific product using `product(id)` query
4. Update product details using `updateProduct`
5. Delete product using `deleteProduct`

### 2. Shopping Cart Flow
1. Create a new cart using `createCart`
2. Add products to cart using `addToCart`
3. Update item quantities using `updateCartItem`
4. View cart contents using `cart(id)` query
5. Remove items using `removeFromCart`
6. Clear cart using `clearCart` or delete using `deleteCart`

### 3. Order Management
1. Create cart and add items
2. Checkout cart to create order using `checkout`
3. View orders using `orders` query
4. Update order status using `updateOrder`
5. Delete order using `deleteOrder`

## Error Handling

The API includes proper error handling for:
- Non-existent resources (404 errors)
- Invalid operations (e.g., adding to inactive cart)
- Empty carts during checkout
- Missing required fields

## Data Persistence

All data is stored in Azure Cosmos DB emulator with three containers:
- **products**: NEMA standards and documents
- **carts**: Shopping carts with items
- **orders**: Completed orders from checkout

## Security Notes

- All operations require proper GraphQL syntax
- IDs are validated before operations
- Cart status is checked before modifications
- Order totals are calculated server-side for security
