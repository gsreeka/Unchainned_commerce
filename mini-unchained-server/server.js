const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { v4: uuidv4 } = require("uuid");
const cosmosDB = require("./database");

// ✅ GraphQL Schema
const schema = buildSchema(`
  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float!
  }

  type CartItem {
    productId: ID!
    quantity: Int!
    product: Product
  }

  type Cart {
    id: ID!
    items: [CartItem!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  type Order {
    id: ID!
    items: [CartItem!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  type Query {
    products: [Product!]!
    cart(id: ID!): Cart
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    createCart: Cart!
    addToCart(cartId: ID!, productId: ID!, quantity: Int!): Cart!
    removeFromCart(cartId: ID!, productId: ID!): Cart!
    updateCartItem(cartId: ID!, productId: ID!, quantity: Int!): Cart!
    clearCart(cartId: ID!): Cart!
    checkout(cartId: ID!): Order!
  }
`);

// ✅ Helper: calculate total
async function calculateCartTotal(cart) {
  let total = 0;
  for (const item of cart.items) {
    const product = await cosmosDB.getProductById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
}

// ✅ Root Resolvers
const root = {
  // Queries
  products: async () => await cosmosDB.getAllProducts(),
  cart: async ({ id }) => await cosmosDB.getCartById(id),
  orders: async () => await cosmosDB.getAllOrders(),
  order: async ({ id }) => await cosmosDB.getOrderById(id),

  // CartItem resolver -> fetch product by productId
  CartItem: {
    product: async (parent) => {
      return await cosmosDB.getProductById(parent.productId);
    },
  },

// Queries
cart: async ({ id }) => {
  const cart = await cosmosDB.getCartById(id);
  return enrichCart(cart);
},

// Mutations
createCart: async () => {
  const cart = {
    id: uuidv4(),
    items: [],
    total: 0,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  const created = await cosmosDB.createCart(cart);
  return enrichCart(created);
},

addToCart: async ({ cartId, productId, quantity }) => {
  const cart = await cosmosDB.getCartById(cartId);
  if (!cart) throw new Error("Cart not found");

  const product = await cosmosDB.getProductById(productId);
  if (!product) throw new Error("Product not found");

  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  cart.total = await calculateCartTotal(cart);
  const updated = await cosmosDB.updateCart(cart);

  return enrichCart(updated); // ✅ important
},

removeFromCart: async ({ cartId, productId }) => {
  const cart = await cosmosDB.getCartById(cartId);
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter((i) => i.productId !== productId);
  cart.total = await calculateCartTotal(cart);

  const updated = await cosmosDB.updateCart(cart);
  return enrichCart(updated); // ✅
},

updateCartItem: async ({ cartId, productId, quantity }) => {
  const cart = await cosmosDB.getCartById(cartId);
  if (!cart) throw new Error("Cart not found");

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
  } else {
    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  cart.total = await calculateCartTotal(cart);
  const updated = await cosmosDB.updateCart(cart);

  return enrichCart(updated); // ✅
},

clearCart: async ({ cartId }) => {
  const cart = await cosmosDB.getCartById(cartId);
  if (!cart) throw new Error("Cart not found");

  cart.items = [];
  cart.total = 0;

  const updated = await cosmosDB.updateCart(cart);
  return enrichCart(updated); // ✅
},

  checkout: async ({ cartId }) => {
    const cart = await cosmosDB.getCartById(cartId);
    if (!cart) throw new Error("Cart not found");
    if (cart.items.length === 0) throw new Error("Cart is empty");

    const total = await calculateCartTotal(cart);

    const order = {
      id: uuidv4(),
      items: cart.items,
      total,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    await cosmosDB.createOrder(order);

    cart.status = "completed";
    await cosmosDB.updateCart(cart);

    return order;
  },
};

// ✅ Start server
async function start() {
  await cosmosDB.initialize();

  const app = express();
  app.use(cors({ origin: "http://localhost:3000" }));

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );

  const PORT = 4000;
  app.listen(PORT, () =>
    console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`)
  );
}

// ✅ Helper: enrich cart items with product details
async function enrichCart(cart) {
  if (!cart) return null;
  const enrichedItems = [];
  for (const item of cart.items) {
    const product = await cosmosDB.getProductById(item.productId);
    enrichedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      product: product || null, // attach product details
    });
  }
  return { ...cart, items: enrichedItems };
}

start();
