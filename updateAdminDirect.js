// Update admin user with correct permissions and fields
db = db.getSiblingDB('unchained_core');

const result = db.users.updateOne(
  { _id: ObjectId("68d3dc28888b867b774d7942") },
  {
    $set: {
      username: "admin",
      isActive: true,
      "emails.0.provides": "default",
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
    }
  }
);

print('Update result:');
printjson(result);

// Verify the update
const admin = db.users.findOne({ _id: ObjectId("68d3dc28888b867b774d7942") });
print('\nUpdated admin user:');
printjson({
  _id: admin._id,
  username: admin.username,
  email: admin.emails && admin.emails[0] ? admin.emails[0].address : 'No email',
  isActive: admin.isActive,
  roles: admin.roles,
  hasPermissions: !!admin.permissions && admin.permissions.length > 0
});
