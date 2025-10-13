import { searchTypeDefs } from '../modules/search/search-schema.js';
import { searchResolvers } from '../modules/search/search-resolvers.js';
import azureSearchService from '../modules/search/azure-search-service.js';

// Integration function to add search capabilities to the Unchained platform
export const integrateAzureSearch = (unchainedAPI) => {
  // Add search schema and resolvers to the GraphQL API
  unchainedAPI.addTypeDefs(searchTypeDefs);
  unchainedAPI.addResolvers(searchResolvers);

  // Hook into product events to keep search index synchronized
  unchainedAPI.on('PRODUCT_CREATE', async ({ product }) => {
    try {
      await azureSearchService.indexDocument({
        id: product._id,
        title: product.texts?.title || '',
        description: product.texts?.description || '',
        type: 'PRODUCT',
        url: `/product/${product.slugs?.[0]}`,
        imageUrl: product.media?.[0]?.file?.url || '',
        category: product.assortmentPaths?.[0]?.links?.[0]?.assortment?.texts?.title || '',
        price: product.simulatedPrice?.price?.amount || 0,
        manufacturer: product.vendor?.name || '',
        inStock: product.stock?.quantity > 0,
        tags: product.tags || [],
        sku: product.warehousing?.sku || ''
      });
      console.log(`Indexed product: ${product._id}`);
    } catch (error) {
      console.error(`Failed to index product ${product._id}:`, error);
    }
  });

  unchainedAPI.on('PRODUCT_UPDATE', async ({ product }) => {
    try {
      await azureSearchService.indexDocument({
        id: product._id,
        title: product.texts?.title || '',
        description: product.texts?.description || '',
        type: 'PRODUCT',
        url: `/product/${product.slugs?.[0]}`,
        imageUrl: product.media?.[0]?.file?.url || '',
        category: product.assortmentPaths?.[0]?.links?.[0]?.assortment?.texts?.title || '',
        price: product.simulatedPrice?.price?.amount || 0,
        manufacturer: product.vendor?.name || '',
        inStock: product.stock?.quantity > 0,
        tags: product.tags || [],
        sku: product.warehousing?.sku || ''
      });
      console.log(`Updated product in index: ${product._id}`);
    } catch (error) {
      console.error(`Failed to update product ${product._id} in index:`, error);
    }
  });

  unchainedAPI.on('PRODUCT_REMOVE', async ({ productId }) => {
    try {
      await azureSearchService.deleteDocument(productId);
      console.log(`Removed product from index: ${productId}`);
    } catch (error) {
      console.error(`Failed to remove product ${productId} from index:`, error);
    }
  });

  console.log('Azure AI Search integration initialized');
};
