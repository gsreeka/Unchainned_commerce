// server.js
const { ApolloServer, gql } = require("apollo-server");
const { v4: uuid } = require("uuid");
const db = require("./database");

const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    description: String
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
  }

  type Mutation {
    createCart: Cart!
    addToCart(cartId: ID!, productId: ID!, quantity: Int!): Cart!
    removeFromCart(cartId: ID!, productId: ID!): Cart!
    updateCartItem(cartId: ID!, productId: ID!, quantity: Int!): Cart!
    clearCart(cartId: ID!): Cart!
    checkout(cartId: ID!): Order!
  }
`;

const resolvers = {
  Query: {
    products: async () => await db.getAllProducts(),
    cart: async (_, { id }) => await db.getCartById(id),
    orders: async () => await db.getAllOrders(),
  },

  Mutation: {
    createCart: async () => {
      const id = uuid();
      const cart = { id, items: [], status: "active" };
      return await db.createCart(cart);
    },

    addToCart: async (_, { cartId, productId, quantity }) => {
      const cart = await db.getCartById(cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      const product = await db.getProductById(productId);
      if (!product) throw new Error("Product not found");

      const existing = cart.items.find(i => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      return await db.updateCart(cart);
    },

    removeFromCart: async (_, { cartId, productId }) => {
      const cart = await db.getCartById(cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      cart.items = cart.items.filter(item => item.productId !== productId);
      return await db.updateCart(cart);
    },

    updateCartItem: async (_, { cartId, productId, quantity }) => {
      const cart = await db.getCartById(cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      const product = await db.getProductById(productId);
      if (!product) throw new Error("Product not found");

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items = cart.items.filter(item => item.productId !== productId);
      } else {
        const existing = cart.items.find(i => i.productId === productId);
        if (existing) {
          existing.quantity = quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      }

      return await db.updateCart(cart);
    },

    clearCart: async (_, { cartId }) => {
      const cart = await db.getCartById(cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      cart.items = [];
      return await db.updateCart(cart);
    },

    checkout: async (_, { cartId }) => {
      const cart = await db.getCartById(cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.items.length === 0) throw new Error("Cart is empty");
      if (cart.status !== "active") throw new Error("Cart already checked out");

      // compute total (server-side)
      let total = 0;
      for (const item of cart.items) {
        const product = await db.getProductById(item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      }

      const order = {
        id: uuid(),
        items: JSON.parse(JSON.stringify(cart.items)), // clone
        total,
        status: "created",
        createdAt: new Date().toISOString()
      };

      await db.createOrder(order);
      cart.status = "completed"; // lock the cart
      await db.updateCart(cart);
      return order;
    }
  },

  // computed fields / nested resolvers
  Cart: {
    total: async (cart) => {
      let total = 0;
      for (const item of cart.items) {
        const product = await db.getProductById(item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      }
      return total;
    }
  },

  CartItem: {
    product: async (item) => await db.getProductById(item.productId)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

// Initialize database connection before starting server
async function startServer() {
  try {
    await db.initialize();
    const { url } = await server.listen({ port: 4000 });
    console.log(`🚀 Server ready at ${url}`);
    console.log(`📊 GraphQL Playground available at ${url}`);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
