import azureSearchService from './azure-search-service.js';

export const searchResolvers = {
  Query: {
    azureSearch: async (_, { query, filters, page, limit }) => {
      try {
        return await azureSearchService.search({
          query,
          filters,
          page,
          limit
        });
      } catch (error) {
        console.error('Search resolver error:', error);
        return {
          results: [],
          totalCount: 0,
          facets: [],
          suggestions: []
        };
      }
    },

    searchSuggestions: async (_, { query }) => {
      try {
        const suggestions = await azureSearchService.getSuggestions(query);
        
        // Also get some product suggestions
        const searchResults = await azureSearchService.search({
          query,
          filters: { type: ['PRODUCT'] },
          page: 1,
          limit: 5
        });

        return {
          suggestions,
          products: searchResults.results.filter(r => r.type === 'PRODUCT').map(r => ({
            id: r.id,
            title: r.title,
            imageUrl: r.imageUrl,
            price: r.price
          }))
        };
      } catch (error) {
        console.error('Search suggestions resolver error:', error);
        return {
          suggestions: [],
          products: []
        };
      }
    },

    searchAutocomplete: async (_, { query }) => {
      try {
        return await azureSearchService.getAutocomplete(query);
      } catch (error) {
        console.error('Search autocomplete resolver error:', error);
        return {
          completions: [],
          categories: [],
          manufacturers: []
        };
      }
    },

    popularSearches: async (_, { limit = 10 }) => {
      // This would typically come from analytics/tracking data
      // For now, return some mock popular searches
      const mockPopularSearches = [
        { term: 'electrical panels', count: 1250 },
        { term: 'circuit breakers', count: 980 },
        { term: 'conduit fittings', count: 875 },
        { term: 'motor starters', count: 720 },
        { term: 'junction boxes', count: 650 },
        { term: 'cable trays', count: 580 },
        { term: 'transformers', count: 520 },
        { term: 'switches', count: 480 },
        { term: 'outlets', count: 420 },
        { term: 'lighting fixtures', count: 380 }
      ];

      return mockPopularSearches.slice(0, limit);
    }
  },

  Mutation: {
    indexProduct: async (_, { productId }) => {
      try {
        // This would typically fetch the product from your database
        // and then index it in Azure Search
        console.log(`Indexing product: ${productId}`);
        return true;
      } catch (error) {
        console.error('Index product mutation error:', error);
        return false;
      }
    },

    reindexAllProducts: async () => {
      try {
        // This would fetch all products and reindex them
        console.log('Starting full reindex...');
        return true;
      } catch (error) {
        console.error('Reindex all products mutation error:', error);
        return false;
      }
    },

    deleteFromIndex: async (_, { documentId }) => {
      try {
        return await azureSearchService.deleteDocument(documentId);
      } catch (error) {
        console.error('Delete from index mutation error:', error);
        return false;
      }
    }
  }
};
