// database.js - Azure Cosmos DB integration
const { CosmosClient } = require("@azure/cosmos");

// Disable SSL verification for Cosmos DB Emulator
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Cosmos DB Emulator configuration
const config = {
  endpoint: "https://localhost:8081",
  key: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
  databaseId: "NEMAStore",
  containerId: {
    products: "Products",
    carts: "Carts", 
    orders: "Orders",
    categories: "Categories"
  }
};

class CosmosDBService {
  constructor() {
    this.client = new CosmosClient({ 
      endpoint: config.endpoint, 
      key: config.key,
      connectionPolicy: {
        enableEndpointDiscovery: false
      }
    });
    this.database = null;
    this.containers = {
      products: null,
      orders: null,
      categories: null
    };
  }

  async initialize() {
    try {
      console.log("Initializing Cosmos DB connection...");
      
      // Create database if it doesn't exist
      const { database } = await this.client.databases.createIfNotExists({
        id: config.databaseId
      });
      this.database = database;
      console.log(`Database '${config.databaseId}' ready`);

      // Create containers
      for (const [key, containerId] of Object.entries(config.containerId)) {
        const { container } = await database.containers.createIfNotExists({
          id: containerId,
          partitionKey: { paths: ["/id"] }
        });
        this.containers[key] = container;
        console.log(`Container '${containerId}' ready`);
      }

      // Seed initial data if products container is empty
      // await this.seedInitialData(); // Disabled - products already exist in database
      
      console.log("✅ Cosmos DB initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Cosmos DB:", error);
      throw error;
    }
  }

  async seedInitialData() {
    try {
      // Check if categories already exist
      const { resources: existingCategories } = await this.containers.categories.items.readAll().fetchAll();
      
      if (existingCategories.length === 0) {
        console.log("Seeding initial NEMA categories...");
        
        // Seed basic categories only
        const categories = [
          {
            id: "1",
            name: "General Standards",
            slug: "general-standards",
            description: "General NEMA standards and specifications",
            parent_id: null,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        for (const category of categories) {
          await this.containers.categories.items.create(category);
        }
        
        console.log(`✅ Seeded ${categories.length} basic categories`);
      }

      console.log("✅ Database ready - no sample products seeded");
    } catch (error) {
      console.error("Error seeding initial data:", error);
    }
  }

  // Category operations
  async getAllCategories() {
    const { resources } = await this.containers.categories.items.readAll().fetchAll();
    return resources;
  }

  async getCategoryById(id) {
    try {
      const { resource } = await this.containers.categories.item(id, id).read();
      return resource;
    } catch (error) {
      if (error.code === 404) return null;
      throw error;
    }
  }

  async createCategory(categoryData) {
    const { resource } = await this.containers.categories.items.create(categoryData);
    return resource;
  }

  async updateCategory(id, categoryData) {
    const { resource } = await this.containers.categories.item(id, id).replace(categoryData);
    return resource;
  }

  async deleteCategory(id) {
    await this.containers.categories.item(id, id).delete();
    return true;
  }

  // Product operations
  async getAllProducts() {
    const { resources } = await this.containers.products.items.readAll().fetchAll();
    return resources;
  }

  async getProductById(id) {
    try {
      const { resource } = await this.containers.products.item(id, id).read();
      return resource;
    } catch (error) {
      if (error.code === 404) return null;
      throw error;
    }
  }

  // Cart operations
  async createCart(cartData) {
    const { resource } = await this.containers.carts.items.create(cartData);
    return resource;
  }

  async getCartById(id) {
    try {
      const { resource } = await this.containers.carts.item(id, id).read();
      return resource;
    } catch (error) {
      if (error.code === 404) return null;
      throw error;
    }
  }

  async updateCart(cart) {
    const { resource } = await this.containers.carts.item(cart.id, cart.id).replace(cart);
    return resource;
  }

  async getAllCarts() {
    const { resources } = await this.containers.carts.items.readAll().fetchAll();
    return resources;
  }

  async deleteCart(id) {
    await this.containers.carts.item(id, id).delete();
    return true;
  }

  // Product CRUD operations
  async createProduct(productData) {
    const { resource } = await this.containers.products.items.create(productData);
    return resource;
  }

  async updateProduct(product) {
    const { resource } = await this.containers.products.item(product.id, product.id).replace(product);
    return resource;
  }

  async deleteProduct(id) {
    await this.containers.products.item(id, id).delete();
    return true;
  }

  // Order operations
  async createOrder(orderData) {
    const { resource } = await this.containers.orders.items.create(orderData);
    return resource;
  }

  async getAllOrders() {
    const { resources } = await this.containers.orders.items.readAll().fetchAll();
    return resources;
  }

  async getOrderById(id) {
    try {
      const { resource } = await this.containers.orders.item(id, id).read();
      return resource;
    } catch (error) {
      if (error.code === 404) return null;
      throw error;
    }
  }

  async updateOrder(order) {
    const { resource } = await this.containers.orders.item(order.id, order.id).replace(order);
    return resource;
  }

  async deleteOrder(id) {
    await this.containers.orders.item(id, id).delete();
    return true;
  }
}

module.exports = new CosmosDBService();
