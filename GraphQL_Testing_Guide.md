# NEMA Store GraphQL Testing Guide

## How to Access GraphQL Playground

1. Start your backend server:
   ```bash
   cd mini-unchained-server
   node server.js
   ```

2. Open GraphQL Playground in your browser:
   ```
   http://localhost:4000
   ```

## Complete Testing Workflow

### 1. Query All Products
```graphql
query GetAllProducts {
  products {
    id
    title
    description
    price
  }
}
```

### 2. Create a New Cart
```graphql
mutation CreateCart {
  createCart {
    id
    items {
      productId
      quantity
    }
    total
  }
}
```
**Note:** Save the returned cart ID for the next steps!

### 3. Add Items to Cart
Replace `YOUR_CART_ID` with the ID from step 2:

```graphql
mutation AddToCart {
  addToCart(cartId: "YOUR_CART_ID", productId: "p1", quantity: 2) {
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
```

Add more items:
```graphql
mutation AddMoreItems {
  addToCart(cartId: "YOUR_CART_ID", productId: "p2", quantity: 1) {
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
```

### 4. View Cart Contents
```graphql
query GetCart {
  cart(id: "YOUR_CART_ID") {
    id
    items {
      productId
      quantity
      product {
        id
        title
        description
        price
      }
    }
    total
  }
}
```

### 5. Checkout Cart
```graphql
mutation CheckoutCart {
  checkout(cartId: "YOUR_CART_ID") {
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
```

### 6. Remove Item from Cart
```graphql
mutation RemoveFromCart {
  removeFromCart(cartId: "YOUR_CART_ID", productId: "p1") {
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
  }
}
```

### 7. Update Item Quantity
```graphql
mutation UpdateQuantity {
  updateCartItem(cartId: "YOUR_CART_ID", productId: "p2", quantity: 5) {
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
  }
}
```

### 8. Clear Entire Cart
```graphql
mutation ClearCart {
  clearCart(cartId: "YOUR_CART_ID") {
    id
    items {
      productId
      quantity
    }
    total
  }
}
```

### 9. View All Orders
```graphql
query GetAllOrders {
  orders {
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
```

### 10. Try to Access Cart After Checkout (Should Fail)
```graphql
query GetCompletedCart {
  cart(id: "YOUR_CART_ID") {
    id
    items {
      productId
      quantity
    }
    total
  }
}
```
**Expected:** Cart should still exist but with status "completed"

## Sample Test Scenario

Here's a complete test flow with actual values:

### Step 1: Get Products
```graphql
query {
  products {
    id
    title
    price
  }
}
```

### Step 2: Create Cart
```graphql
mutation {
  createCart {
    id
  }
}
```
**Example Response:** `{ "data": { "createCart": { "id": "abc123" } } }`

### Step 3: Add NEMA Standards
```graphql
# Add ANSI/NEMA MG 00001-2024 ($931.00)
mutation {
  addToCart(cartId: "abc123", productId: "p1", quantity: 1) {
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
  }
}

# Add NEMA TS 10-2020 ($219.00)
mutation {
  addToCart(cartId: "abc123", productId: "p2", quantity: 2) {
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
  }
}
```

### Step 4: Check Cart Total
```graphql
query {
  cart(id: "abc123") {
    total
    items {
      quantity
      product {
        title
        price
      }
    }
  }
}
```
**Expected Total:** $931.00 + ($219.00 × 2) = $1,369.00

### Step 5: Checkout
```graphql
mutation {
  checkout(cartId: "abc123") {
    id
    total
    status
    createdAt
  }
}
```

### Step 6: Verify Order Created
```graphql
query {
  orders {
    id
    total
    status
    createdAt
  }
}
```

## Error Testing

### Test Invalid Cart ID
```graphql
query {
  cart(id: "invalid-id") {
    id
  }
}
```
**Expected:** Returns `null`

### Test Adding to Non-existent Cart
```graphql
mutation {
  addToCart(cartId: "invalid-id", productId: "p1", quantity: 1) {
    id
  }
}
```
**Expected:** Error "Cart not found"

### Test Adding Invalid Product
```graphql
mutation {
  addToCart(cartId: "YOUR_CART_ID", productId: "invalid-product", quantity: 1) {
    id
  }
}
```
**Expected:** Error "Product not found"

### Test Checkout Empty Cart
```graphql
# First create empty cart
mutation {
  createCart {
    id
  }
}

# Then try to checkout immediately
mutation {
  checkout(cartId: "EMPTY_CART_ID") {
    id
  }
}
```
**Expected:** Error "Cart is empty"

### Test Double Checkout
```graphql
# Checkout once (should work)
mutation {
  checkout(cartId: "YOUR_CART_ID") {
    id
  }
}

# Try to checkout again (should fail)
mutation {
  checkout(cartId: "YOUR_CART_ID") {
    id
  }
}
```
**Expected:** Error "Cart already checked out"

## PowerShell Testing (Alternative)

You can also test using PowerShell commands:

```powershell
# Get all products
Invoke-RestMethod -Uri "http://localhost:4000" -Method POST -ContentType "application/json" -Body '{"query": "{ products { id title price } }"}'

# Create cart
Invoke-RestMethod -Uri "http://localhost:4000" -Method POST -ContentType "application/json" -Body '{"query": "mutation { createCart { id } }"}'

# Add to cart (replace CART_ID)
Invoke-RestMethod -Uri "http://localhost:4000" -Method POST -ContentType "application/json" -Body '{"query": "mutation { addToCart(cartId: \"CART_ID\", productId: \"p1\", quantity: 1) { total } }"}'
```

## Expected Product Catalog

Your backend should return these NEMA standards:

1. **ANSI/NEMA MG 00001-2024** - $931.00
2. **NEMA TS 10-2020** - $219.00
3. **NEMA WC 70-2018** - $285.00
4. **NEMA AB 1-2016** - $395.00
5. **NEMA SS 1-2013** - $175.00
6. **NEMA FB 1-2014** - $145.00
7. **NEMA TC 2-2013** - $125.00
8. **NEMA ICS 1-2000** - $245.00
9. **NEMA SB 2-2016** - $315.00
10. **NEMA WD 6-2016** - $165.00
11. **NEMA C29.1-2018** - $425.00
12. **NEMA PV 1-2016** - $195.00

## Troubleshooting

- **Server not responding:** Make sure `node server.js` is running on port 4000
- **GraphQL Playground not loading:** Check http://localhost:4000 in browser
- **Mutations failing:** Ensure you're using valid cart IDs from previous responses
- **Cart not found:** Cart IDs are temporary and reset when server restarts
