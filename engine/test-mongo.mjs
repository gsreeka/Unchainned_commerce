import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = 'mongodb://host.docker.internal:27017/unchained_core';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check products collection if it exists
    if (collections.some(c => c.name === 'products')) {
      const products = await db.collection('products').find().limit(5).toArray();
      console.log('First 5 products:', JSON.stringify(products, null, 2));
    }
    
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await client.close();
  }
}

testConnection();
