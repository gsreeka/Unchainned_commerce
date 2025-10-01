db = db.getSiblingDB('unchained_core');

// Update admin user with necessary roles and permissions
db.users.updateOne(
  { username: "admin" },
  {
    $set: {
      roles: ["admin", "user"],
      isActive: true,
      emails: [{
        address: "admin@example.com",
        verified: true
      }],
      profile: {
        displayName: "Admin User",
        firstName: "Admin",
        lastName: "User"
      },
      updatedAt: new Date()
    }
  }
);

print('Admin user updated successfully!');
