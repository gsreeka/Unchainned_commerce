db = db.getSiblingDB('unchained_core');

db.users.insertOne({
  "username": "admin",
  "emails": [{
    "address": "admin@example.com",
    "verified": true
  }],
  "profile": {
    "displayName": "Admin User",
    "firstName": "Admin",
    "lastName": "User"
  },
  "roles": ["admin"],
  "services": {
    "password": {
      "bcrypt": "$2b$10$8tF2jSv5J0eF3v3J5X5X5e"  // password123
    },
    "resume": {
      "loginTokens": []
    }
  },
  "created": new Date(),
  "updatedAt": new Date()
});

print('Admin user created successfully!');
