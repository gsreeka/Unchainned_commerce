db = db.getSiblingDB('unchained_core');

// Remove any existing admin user
db.users.deleteMany({"username": "admin"});

// Create new admin user
var adminUser = {
    "_id" : "admin",
    "created" : new Date(),
    "emails" : [ 
        {
            "address" : "admin@example.com",
            "verified" : true
        }
    ],
    "profile" : {
        "name" : "Admin User"
    },
    "roles" : [ "admin" ],
    "services" : {
        "password" : {
            "bcrypt" : "$2b$10$8tF2jSv5J0eF3v3J5X5X5e"  // password123
        },
        "resume" : {
            "loginTokens" : []
        }
    },
    "status" : {
        "online" : false
    },
    "updatedAt" : new Date(),
    "username" : "admin"
};

db.users.insertOne(adminUser);
print('Admin user created successfully!');
