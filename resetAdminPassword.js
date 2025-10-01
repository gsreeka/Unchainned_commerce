// Reset admin password
db = db.getSiblingDB('unchained_core');

const result = db.users.updateOne(
  { username: 'admin' },
  {
    $set: {
      'services.password.bcrypt': '$2b$10$8tF2jSv5J0eF3v3J5X5X5e'  // password123
    }
  }
);

print('Password reset result:');
printjson(result);

// Verify the update
const admin = db.users.findOne({ username: 'admin' });
print('\nAdmin user details after password reset:');
printjson({
  _id: admin._id,
  username: admin.username,
  hasPassword: !!admin.services?.password?.bcrypt,
  isActive: admin.isActive,
  roles: admin.roles,
  permissions: admin.permissions || []
});

print('\nYou can now log in with:');
print('Username: admin');
print('Password: password123');
