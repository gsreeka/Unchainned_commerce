db = db.getSiblingDB('unchained_core');

// Remove any existing admin user
db.users.deleteMany({ username: "admin" });

// Create a new admin user with all permissions
const adminUser = {
  _id: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  username: "admin",
  emails: [{
    address: "admin@unchained.local",
    verified: true
  }],
  profile: {
    displayName: "Admin User",
    firstName: "Admin",
    lastName: "User"
  },
  roles: ["admin", "user"],
  isActive: true,
  services: {
    password: {
      bcrypt: "$2b$10$8tF2jSv5J0eF3v3J5X5X5e"  // password123
    },
    resume: {
      loginTokens: []
    }
  },
  // Add all required permissions
  permissions: [
    "admin",
    "viewAdminUI",
    "viewOrders",
    "viewUserCount",
    "viewUsers",
    "viewProducts",
    "manageProducts",
    "viewAssortments",
    "manageAssortments",
    "viewFilters",
    "manageFilters",
    "viewUsers",
    "manageUsers",
    "viewOrders",
    "manageOrders",
    "viewPayment",
    "managePayment",
    "viewDelivery",
    "manageDelivery",
    "viewWarehousing",
    "manageWarehousing"
  ]
};

db.users.insertOne(adminUser);
print('Admin user has been reset with full permissions!');
