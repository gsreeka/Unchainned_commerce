import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

class AzureSearchService {
  constructor() {
    this.searchClient = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT,
      process.env.AZURE_SEARCH_INDEX_NAME,
      new AzureKeyCredential(process.env.AZURE_SEARCH_API_KEY)
    );
    
    this.suggestClient = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT,
      `${process.env.AZURE_SEARCH_INDEX_NAME}-suggestions`,
      new AzureKeyCredential(process.env.AZURE_SEARCH_API_KEY)
    );
  }

  async search({ query, filters = {}, page = 1, limit = 20 }) {
    try {
      const searchOptions = {
        top: limit,
        skip: (page - 1) * limit,
        includeTotalCount: true,
        facets: [
          'category',
          'manufacturer',
          'type',
          'priceRange'
        ],
        highlightFields: ['title', 'description'],
        searchMode: 'any',
        queryType: 'semantic'
      };

      // Build filter expression
      const filterExpressions = [];
      
      if (filters.category && filters.category.length > 0) {
        const categoryFilter = filters.category.map(cat => `category eq '${cat}'`).join(' or ');
        filterExpressions.push(`(${categoryFilter})`);
      }
      
      if (filters.manufacturer && filters.manufacturer.length > 0) {
        const manufacturerFilter = filters.manufacturer.map(mfg => `manufacturer eq '${mfg}'`).join(' or ');
        filterExpressions.push(`(${manufacturerFilter})`);
      }
      
      if (filters.type && filters.type.length > 0) {
        const typeFilter = filters.type.map(type => `type eq '${type}'`).join(' or ');
        filterExpressions.push(`(${typeFilter})`);
      }
      
      if (filters.priceRange) {
        filterExpressions.push(`price ge ${filters.priceRange.min} and price le ${filters.priceRange.max}`);
      }
      
      if (filters.inStock) {
        filterExpressions.push('inStock eq true');
      }

      if (filterExpressions.length > 0) {
        searchOptions.filter = filterExpressions.join(' and ');
      }

      const searchResults = await this.searchClient.search(query, searchOptions);
      
      const results = [];
      const facets = {};
      
      for await (const result of searchResults.results) {
        results.push({
          id: result.document.id,
          title: result.document.title,
          description: result.document.description,
          type: result.document.type,
          url: result.document.url,
          imageUrl: result.document.imageUrl,
          score: result.score,
          highlights: result.highlights ? Object.values(result.highlights).flat() : [],
          category: result.document.category,
          price: result.document.price,
          manufacturer: result.document.manufacturer
        });
      }

      // Process facets
      if (searchResults.facets) {
        Object.entries(searchResults.facets).forEach(([facetName, facetValues]) => {
          facets[facetName] = {
            name: facetName,
            values: facetValues.map(fv => ({
              value: fv.value,
              count: fv.count
            }))
          };
        });
      }

      return {
        results,
        totalCount: searchResults.count || 0,
        facets: Object.values(facets),
        suggestions: await this.getSuggestions(query)
      };

    } catch (error) {
      console.error('Azure Search error:', error);
      throw new Error('Search service unavailable');
    }
  }

  async getSuggestions(query) {
    try {
      if (!query || query.length < 2) return [];

      const suggestOptions = {
        suggesterName: 'sg',
        top: 5,
        useFuzzyMatching: true
      };

      const suggestions = await this.searchClient.suggest(query, suggestOptions);
      return suggestions.results.map(result => result.text);
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  async getAutocomplete(query) {
    try {
      if (!query || query.length < 2) {
        return {
          completions: [],
          categories: [],
          manufacturers: []
        };
      }

      const autocompleteOptions = {
        suggesterName: 'sg',
        mode: 'twoTerms',
        top: 8,
        useFuzzyMatching: true
      };

      const autocompleteResults = await this.searchClient.autocomplete(query, autocompleteOptions);
      
      // Get category and manufacturer suggestions
      const categorySearch = await this.searchClient.search(query, {
        top: 0,
        facets: ['category', 'manufacturer']
      });

      const categories = [];
      const manufacturers = [];

      if (categorySearch.facets) {
        if (categorySearch.facets.category) {
          categories.push(...categorySearch.facets.category.slice(0, 3).map(f => f.value));
        }
        if (categorySearch.facets.manufacturer) {
          manufacturers.push(...categorySearch.facets.manufacturer.slice(0, 3).map(f => f.value));
        }
      }

      return {
        completions: autocompleteResults.results.map(result => result.text),
        categories,
        manufacturers
      };
    } catch (error) {
      console.error('Autocomplete error:', error);
      return {
        completions: [],
        categories: [],
        manufacturers: []
      };
    }
  }

  async indexDocument(document) {
    try {
      const indexResult = await this.searchClient.uploadDocuments([document]);
      return indexResult.results[0].succeeded;
    } catch (error) {
      console.error('Index document error:', error);
      return false;
    }
  }

  async indexProducts(products) {
    try {
      const documents = products.map(product => ({
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
      }));

      const batchSize = 100;
      const results = [];

      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const batchResult = await this.searchClient.uploadDocuments(batch);
        results.push(...batchResult.results);
      }

      return results.filter(r => r.succeeded).length;
    } catch (error) {
      console.error('Index products error:', error);
      return 0;
    }
  }

  async deleteDocument(documentId) {
    try {
      const deleteResult = await this.searchClient.deleteDocuments([{ id: documentId }]);
      return deleteResult.results[0].succeeded;
    } catch (error) {
      console.error('Delete document error:', error);
      return false;
    }
  }
}

export default new AzureSearchService();
