// Completely reset the admin user
db = db.getSiblingDB('unchained_core');

// Remove existing admin user
db.users.deleteMany({ username: 'admin' });

// Create a new admin user with a known password (password: admin123)
const result = db.users.insertOne({
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
      bcrypt: '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQRqQz6F7dU8kNaH5PA4JY3zPjzkj/O' // admin123
    },
    resume: {
      loginTokens: []
    }
  },
  permissions: [
    'admin',
    'viewAdminUI',
    'viewUserCount',
    'viewUsers',
    'manageUsers',
    'viewProducts',
    'manageProducts',
    'viewAssortments',
    'manageAssortments',
    'viewFilters',
    'manageFilters',
    'viewOrders',
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
});

print('Admin user has been reset.');
print('Username: admin');
print('Password: admin123');
print('Email: admin@unchained.local');
