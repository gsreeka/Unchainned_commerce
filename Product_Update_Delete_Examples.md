# Product Update & Delete Operations Guide

## 🔄 UPDATE Products

### 1. Get Product ID First
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

### 2. Update Entire Product
```graphql
mutation UpdateProduct {
  updateProduct(id: "p1", input: {
    title: "ANSI/NEMA MG 00001-2025 (Updated Edition)"
    description: "Motors and Generators - Latest Standards"
    price: 999.99
  }) {
    id
    title
    description
    price
  }
}
```

### 3. Update Only Price
```graphql
mutation UpdateProductPrice {
  updateProduct(id: "p2", input: {
    price: 299.99
  }) {
    id
    title
    description
    price
  }
}
```

### 4. Update Only Title
```graphql
mutation UpdateProductTitle {
  updateProduct(id: "p3", input: {
    title: "NEMA WC 70-2024 (Revised)"
  }) {
    id
    title
    description
    price
  }
}
```

## 🗑️ DELETE Products

### 1. Delete by Product ID
```graphql
mutation DeleteProduct {
  deleteProduct(id: "p12")
}
```

### 2. Delete Multiple Products (run separately)
```graphql
# Delete first product
mutation DeleteProduct1 {
  deleteProduct(id: "p10")
}

# Delete second product
mutation DeleteProduct2 {
  deleteProduct(id: "p11")
}
```

## 📋 Complete Workflow Example

### Step 1: View Current Products
```graphql
query {
  products {
    id
    title
    price
  }
}
```

### Step 2: Update a Product
```graphql
mutation {
  updateProduct(id: "p1", input: {
    title: "ANSI/NEMA MG 00001-2025"
    price: 1050.00
  }) {
    id
    title
    description
    price
  }
}
```

### Step 3: Verify Update
```graphql
query {
  product(id: "p1") {
    id
    title
    description
    price
  }
}
```

### Step 4: Delete a Product
```graphql
mutation {
  deleteProduct(id: "p12")
}
```

### Step 5: Verify Deletion
```graphql
query {
  products {
    id
    title
  }
}
```

## 🎯 Quick Reference

| Operation | GraphQL Mutation | Returns |
|-----------|------------------|---------|
| Update Product | `updateProduct(id, input)` | Updated Product Object |
| Delete Product | `deleteProduct(id)` | Boolean (true/false) |
| Get Product | `product(id)` | Product Object |
| Get All Products | `products` | Array of Products |

## 💡 Tips

1. **Always get the product ID first** using the `products` query
2. **Partial updates are supported** - only include fields you want to change
3. **Deletion is permanent** - make sure you have the correct ID
4. **Use GraphQL Playground** at http://localhost:4000 for interactive testing
5. **Check results** by querying the product after update/delete operations

## 🚨 Error Handling

- **Product not found**: Returns "Product not found" error
- **Invalid ID**: Returns validation error
- **Missing required fields**: Returns field validation error
