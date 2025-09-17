// view-data.js - Quick script to view database contents
const db = require("./database");

async function viewAllData() {
  try {
    await db.initialize();
    
    console.log("\n🏪 NEMA PRODUCTS:");
    console.log("==================");
    const products = await db.getAllProducts();
    products.forEach(p => {
      console.log(`${p.id}: ${p.title} - $${p.price}`);
    });
    
    console.log("\n🛒 CARTS:");
    console.log("=========");
    const carts = await db.containers.carts.items.readAll().fetchAll();
    if (carts.resources.length === 0) {
      console.log("No carts created yet");
    } else {
      carts.resources.forEach(cart => {
        console.log(`Cart ${cart.id}: ${cart.items.length} items, Status: ${cart.status}`);
      });
    }
    
    console.log("\n📦 ORDERS:");
    console.log("==========");
    const orders = await db.getAllOrders();
    if (orders.length === 0) {
      console.log("No orders created yet");
    } else {
      orders.forEach(order => {
        console.log(`Order ${order.id}: $${order.total}, Status: ${order.status}`);
      });
    }
    
    console.log("\n✅ Database view complete!");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error viewing data:", error);
    process.exit(1);
  }
}

viewAllData();
