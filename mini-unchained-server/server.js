// server.js
const { ApolloServer, gql } = require("apollo-server");
const { v4: uuid } = require("uuid");
const db = require("./database");

const typeDefs = gql`
  type AccessOption {
    type: String!
    price_usd: Float!
    sku: String!
  }

  type ProductMetadata {
    document_type: String!
    format_support: [String!]!
    is_replaced: Boolean!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    parent_id: ID
    sort_order: Int!
    created_at: String
    updated_at: String
  }

  type Product {
    id: ID!
    doc_number: String
    title: String!
    short_title: String
    series: String
    part: Int
    revision: String
    status: String
    description: String
    publisher: String
    publication_year: Int
    languages: [String!]
    access: [AccessOption!]
    multi_user: Boolean
    categories: [Int!]
    tags: [String!]
    url: String
    created_at: String
    updated_at: String
    metadata: ProductMetadata
    # Legacy field for compatibility
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
    categories: [Category!]!
    cart(id: ID!): Cart
    orders: [Order!]!
  }

  input ProductInput {
    doc_number: String
    title: String!
    short_title: String
    series: String
    part: Int
    revision: String
    status: String
    description: String
    publisher: String
    publication_year: Int
    languages: [String!]
    multi_user: Boolean
    categories: [Int!]
    tags: [String!]
    price: Float!
  }

  input OrderInput {
    status: String
  }

  input CategoryInput {
    name: String!
    slug: String!
    description: String
    parent_id: ID
    sort_order: Int
  }

  type Mutation {
    createCart: Cart!
    addToCart(cartId: ID!, productId: ID!, quantity: Int!): Cart!
    removeFromCart(cartId: ID!, productId: ID!): Cart!
    updateCartItem(cartId: ID!, productId: ID!, quantity: Int!): Cart!
    clearCart(cartId: ID!): Cart!
    checkout(cartId: ID!): Order!
    
    # Product CRUD
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    
    # Category CRUD
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    
    # Order CRUD
    updateOrder(id: ID!, input: OrderInput!): Order!
    deleteOrder(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    products: async () => await db.getAllProducts(),
    categories: async () => await db.getAllCategories(),
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
      if (cart.status !== "active") throw new Error("Cart is not active");
      if (cart.items.length === 0) throw new Error("Cart is empty");

      let total = 0;
      for (const item of cart.items) {
        const product = await db.getProductById(item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      }

      const order = {
        id: uuid(),
        items: cart.items,
        total,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await db.createOrder(order);
      cart.status = "completed";
      await db.updateCart(cart);
      return order;
    },

    // Product CRUD operations
    createProduct: async (_, { input }) => {
      console.log('Server: Received createProduct mutation with input:', input);
      
      try {
        const id = uuid();
        const product = { 
          id, 
          ...input,
          access: [
            {
              type: "secure_pdf",
              price_usd: input.price,
              sku: `PDF-${input.series || 'STD'}-${Date.now()}`
            }
          ],
          url: `/nema/catalog/${input.series?.toLowerCase() || 'standard'}/${id}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            document_type: "standard",
            format_support: ["pdf", "print"],
            is_replaced: false
          }
        };
        
        console.log('Server: Creating product with data:', product);
        
        const result = await db.createProduct(product);
        console.log('Server: Product created successfully:', result);
        return result;
      } catch (error) {
        console.error('Server: Error creating product:', error);
        throw error;
      }
    },

    updateProduct: async (_, { id, input }) => {
      const product = await db.getProductById(id);
      if (!product) throw new Error("Product not found");
      
      const updatedProduct = { ...product, ...input };
      return await db.updateProduct(updatedProduct);
    },

    deleteProduct: async (_, { id }) => {
      const product = await db.getProductById(id);
      if (!product) throw new Error("Product not found");
      
      await db.deleteProduct(id);
      return true;
    },

    // Order CRUD operations
    updateOrder: async (_, { id, input }) => {
      const order = await db.getOrderById(id);
      if (!order) throw new Error("Order not found");
      
      const updatedOrder = { ...order, ...input };
      return await db.updateOrder(updatedOrder);
    },

    deleteOrder: async (_, { id }) => {
      const order = await db.getOrderById(id);
      if (!order) throw new Error("Order not found");
      
      await db.deleteOrder(id);
      return true;
    },

    // Category CRUD operations
    createCategory: async (_, { input }) => {
      const id = parseInt(Date.now().toString().slice(-6)); // Generate numeric ID
      const category = {
        id: id.toString(),
        ...input,
        sort_order: input.sort_order || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return await db.createCategory(category);
    },

    updateCategory: async (_, { id, input }) => {
      const category = await db.getCategoryById(id);
      if (!category) throw new Error("Category not found");
      
      const updatedCategory = { 
        ...category, 
        ...input,
        updated_at: new Date().toISOString()
      };
      return await db.updateCategory(id, updatedCategory);
    },

    deleteCategory: async (_, { id }) => {
      const category = await db.getCategoryById(id);
      if (!category) throw new Error("Category not found");
      
      await db.deleteCategory(id);
      return true;
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

// Initialize database and start server
async function startServer() {
  try {
    await db.initialize();
    const { url } = await server.listen({ port: 4001 });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
