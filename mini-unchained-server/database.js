
// database.js - Azure Cosmos DB integration
const { CosmosClient } = require("@azure/cosmos");

// Disable SSL verification for Cosmos DB Emulator
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Cosmos DB Emulator configuration
const config = {
  endpoint: "https://localhost:8081",
  key: process.env.DB_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
  databaseId: "NEMAStore",
  containerId: {
    products: "Products",
    carts: "Carts", 
    orders: "Orders"
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
    this.containers = {};
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
      await this.seedInitialData();

      console.log("✅ Cosmos DB initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Cosmos DB:", error);
      throw error;
    }
  }

  async seedInitialData() {
    try {
      // Check if products already exist
      const { resources: existingProducts } = await this.containers.products.items.readAll().fetchAll();

      if (existingProducts.length === 0) {
        console.log("Seeding initial NEMA products...");

        const initialProducts = [
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

        for (const product of initialProducts) {
          await this.containers.products.items.create(product);
        }

        console.log(`✅ Seeded ${initialProducts.length} NEMA products`);
      }
    } catch (error) {
      console.error("Error seeding initial data:", error);
    }
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
}

module.exports = new CosmosDBService();