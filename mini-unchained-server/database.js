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
        
        const sampleProducts = [
          {
            id: "1",
            title: "ANSI/NEMA MG 1-2016",
            description: "Motors and Generators - Comprehensive standard covering AC and DC motors, generators, and motor-generator sets including performance, efficiency, and testing requirements.",
            price: 425.00
          },
          {
            id: "2", 
            title: "ANSI/NEMA ICS 1-2000 (R2020)",
            description: "Industrial Control and Systems: General Requirements - Fundamental standard for industrial control equipment including contactors, motor starters, and control circuits.",
            price: 285.00
          },
          {
            id: "3",
            title: "ANSI/NEMA WC 70-2018", 
            description: "Power Cables Rated 2000 Volts or Less for the Distribution of Electrical Energy - Specifications for insulated power cables used in electrical distribution systems.",
            price: 310.00
          },
          {
            id: "4",
            title: "ANSI/NEMA TS 10-2020",
            description: "Traffic Controller Assemblies with NTCIP Requirements - Standard for traffic signal controllers including NTCIP protocol compliance and interoperability.",
            price: 195.00
          },
          {
            id: "5",
            title: "ANSI/NEMA 250-2020",
            description: "Enclosures for Electrical Equipment (1000 Volts Maximum) - Classification and testing of electrical enclosures for indoor and outdoor applications.",
            price: 275.00
          },
          {
            id: "6",
            title: "ANSI/NEMA ICS 2-2020",
            description: "Industrial Control and Systems: Controllers, Contactors, and Overload Relays Rated 600 V - Requirements for low-voltage industrial control devices.",
            price: 235.00
          },
          {
            id: "7",
            title: "ANSI/NEMA FB 1-2016",
            description: "Fittings, Cast Metal Boxes, and Conduit Bodies for Use with Rigid Metal Conduit and Intermediate Metal Conduit - Specifications for electrical fittings.",
            price: 165.00
          },
          {
            id: "8",
            title: "ANSI/NEMA TC 2-2003 (R2018)",
            description: "Electrical Plastic Tubing (EPT) and Conduit (EPC-40 and EPC-80) - Standards for non-metallic electrical conduit systems.",
            price: 145.00
          },
          {
            id: "9",
            title: "ANSI/NEMA ICS 6-2016",
            description: "Industrial Control and Systems: Enclosures - Requirements for industrial control equipment enclosures including NEMA ratings and environmental protection.",
            price: 205.00
          },
          {
            id: "10",
            title: "ANSI/NEMA WC 74-2020",
            description: "Flexible Cord and Fixture Wire - Specifications for portable cord sets, extension cords, and fixture wiring used in electrical applications.",
            price: 185.00
          },
          {
            id: "11",
            title: "ANSI/NEMA SS 1-2020",
            description: "Surge Suppressors (Low Voltage) - Performance requirements and test methods for surge protective devices used in low-voltage electrical systems.",
            price: 225.00
          },
          {
            id: "12",
            title: "ANSI/NEMA ICS 4-2005 (R2020)",
            description: "Industrial Control and Systems: Terminal Blocks - Requirements for terminal blocks used in industrial control panels and electrical equipment.",
            price: 155.00
          }
        ];

        for (const product of sampleProducts) {
          await this.containers.products.items.create(product);
        }
        
        console.log(`✅ Seeded ${sampleProducts.length} NEMA products`);
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
