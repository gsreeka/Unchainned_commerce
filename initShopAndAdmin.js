db = db.getSiblingDB('unchained_core');

// 1. Ensure the shop exists with default language
const shop = db.shops.findOne({});

if (!shop) {
  // Create a default shop if it doesn't exist
  db.shops.insertOne({
    _id: 'shop',
    language: 'en',
    country: 'US',
    currency: 'USD',
    baseUnitPriceFactor: 1,
    baseCurrency: 'USD',
    baseLanguage: 'en',
    contact: {
      emailAddress: 'admin@unchained.local',
      companyName: 'Unchained Shop',
      address: {}
    },
    texts: [
      {
        locale: 'en',
        title: 'Unchained Shop',
        description: 'Unchained Shop',
      }
    ],
    version: '1.0.0',
    created: new Date(),
    updated: new Date()
  });
  print('Created default shop');
}

// 2. Remove any existing admin user
db.users.deleteMany({ username: 'admin' });

// 3. Create a new admin user with all necessary permissions
const adminUser = {
  _id: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
  username: 'admin',
  emails: [{
    address: 'admin@unchained.local',
    verified: true,
    provides: 'default'
  }],
  profile: {
    displayName: 'Admin User',
    firstName: 'Admin',
    lastName: 'User'
  },
  roles: ['admin'],
  isActive: true,
  services: {
    password: {
      bcrypt: '$2b$10$8tF2jSv5J0eF3v3J5X5X5e'  // password123
    },
    resume: {
      loginTokens: []
    }
  },
  permissions: [
    'admin',
    'viewAdminUI',
    'viewOrders',
    'viewUserCount',
    'viewUsers',
    'viewProducts',
    'manageProducts',
    'viewAssortments',
    'manageAssortments',
    'viewFilters',
    'manageFilters',
    'manageUsers',
    'manageOrders',
    'viewPayment',
    'managePayment',
    'viewDelivery',
    'manageDelivery',
    'viewWarehousing',
    'manageWarehousing',
    'viewLanguages',
    'manageLanguages',
    'viewShopInfo',
    'manageShopInfo',
    'viewSystemStatus',
    'manageSystemStatus'
  ]
};

// Insert the new admin user
const result = db.users.insertOne(adminUser);
print('Admin user created with _id: ' + result.insertedId);

// Verify the user was created
const createdUser = db.users.findOne({ _id: result.insertedId });
print('\nAdmin user details:');
printjson({
  _id: createdUser._id,
  username: createdUser.username,
  email: createdUser.emails && createdUser.emails[0] ? createdUser.emails[0].address : 'No email',
  roles: createdUser.roles,
  isActive: createdUser.isActive,
  hasPassword: !!createdUser.services?.password?.bcrypt,
  permissions: createdUser.permissions || []
});

print('\nInitialization complete. You can now log in with:');
print('Username: admin');
print('Password: password123');
print('Email: admin@unchained.local');
