// server.js
const { ApolloServer, gql } = require("apollo-server");
const { v4: uuid } = require("uuid");

/**
 * In-memory data stores (for learning/demo).
 * Replace these with a real DB in production.
 */
const products = [
  { id: "p1", title: "ANSI/NEMA MG 00001-2024", description: "Motors and Generators", price: 931.00 },
  { id: "p2", title: "NEMA TS 10-2020", description: "Traffic Controller Assemblies with NTCIP Requirements", price: 219.00 },
  { id: "p3", title: "NEMA WC 70-2018", description: "Power Cables Rated 2000 Volts or Less for the Distribution of Electrical Energy", price: 285.00 },
  { id: "p4", title: "NEMA AB 1-2016", description: "Molded Case Circuit Breakers, Molded Case Switches, and Circuit Breaker Enclosures", price: 395.00 },
  { id: "p5", title: "NEMA SS 1-2013", description: "Enclosures for Industrial Controls and Systems", price: 175.00 },
  { id: "p6", title: "NEMA FB 1-2014", description: "Fittings, Cast Metal Boxes, and Conduit Bodies for Conduit and Cable Assemblies", price: 145.00 },
  { id: "p7", title: "NEMA TC 2-2013", description: "Electrical Plastic Tubing (EPT) and Conduit Schedule 40 and 80", price: 125.00 },
  { id: "p8", title: "NEMA ICS 1-2000", description: "Industrial Control and Systems: General Requirements", price: 245.00 },
  { id: "p9", title: "NEMA SB 2-2016", description: "Switchboards", price: 315.00 },
  { id: "p10", title: "NEMA WD 6-2016", description: "Wiring Devices - Dimensional Requirements", price: 165.00 },
  { id: "p11", title: "NEMA C29.1-2018", description: "Test Methods for Electrical Power Insulators", price: 425.00 },
  { id: "p12", title: "NEMA PV 1-2016", description: "Photovoltaic (PV) Power Systems", price: 195.00 }
];

const carts = [];   // { id, items: [{ productId, quantity }], status }
const orders = [];  // { id, items, total, createdAt, status }

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
    products: () => products,
    cart: (_, { id }) => carts.find(c => c.id === id) || null,
    orders: () => orders,
  },

  Mutation: {
    createCart: () => {
      const id = uuid();
      const cart = { id, items: [], status: "active" };
      carts.push(cart);
      return cart;
    },

    addToCart: (_, { cartId, productId, quantity }) => {
      const cart = carts.find(c => c.id === cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      const product = products.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");

      const existing = cart.items.find(i => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      return cart;
    },

    removeFromCart: (_, { cartId, productId }) => {
      const cart = carts.find(c => c.id === cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      cart.items = cart.items.filter(item => item.productId !== productId);
      return cart;
    },

    updateCartItem: (_, { cartId, productId, quantity }) => {
      const cart = carts.find(c => c.id === cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      const product = products.find(p => p.id === productId);
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

      return cart;
    },

    clearCart: (_, { cartId }) => {
      const cart = carts.find(c => c.id === cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.status !== "active") throw new Error("Cart is not active");

      cart.items = [];
      return cart;
    },

    checkout: (_, { cartId }) => {
      const cart = carts.find(c => c.id === cartId);
      if (!cart) throw new Error("Cart not found");
      if (cart.items.length === 0) throw new Error("Cart is empty");
      if (cart.status !== "active") throw new Error("Cart already checked out");

      // compute total (server-side)
      const total = cart.items.reduce((sum, item) => {
        const p = products.find(prod => prod.id === item.productId);
        return sum + (p.price * item.quantity);
      }, 0);

      const order = {
        id: uuid(),
        items: JSON.parse(JSON.stringify(cart.items)), // clone
        total,
        status: "created",
        createdAt: new Date().toISOString()
      };

      orders.push(order);
      cart.status = "completed"; // lock the cart
      return order;
    }
  },

  // computed fields / nested resolvers
  Cart: {
    total: (cart) =>
      cart.items.reduce((sum, item) => {
        const p = products.find(prod => prod.id === item.productId);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0)
  },

  CartItem: {
    product: (item) => products.find(p => p.id === item.productId) || null
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
