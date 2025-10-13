import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import MetaTags from '../modules/common/components/MetaTags';
import EnhancedSearchBar from '../modules/search/components/EnhancedSearchBar';
import ProductListItem from '../modules/products/components/ProductListItem';
import { useProductSearch } from '../modules/search/hooks/useProductSearch';

const Search = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { q: queryParam } = router.query;
  
  const initialQuery = typeof queryParam === 'string' ? queryParam : '';
  const [showFilters, setShowFilters] = useState(false);

  // Use the real product search hook
  const {
    query,
    filters,
    results,
    totalCount,
    facets,
    suggestions,
    loading,
    error,
    updateQuery,
    updateFilters,
    clearSearch
  } = useProductSearch(initialQuery);

  const handleSearch = (searchQuery: string) => {
    updateQuery(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`, undefined, { shallow: true });
  };

  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
  };

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      updateQuery(initialQuery);
    }
  }, [initialQuery, query, updateQuery]);

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'search', defaultMessage: 'Search' })}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {formatMessage({
                id: 'search_products',
                defaultMessage: 'Search Products & Standards',
              })}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {formatMessage({
                id: 'search_description',
                defaultMessage: "Find exactly what you're looking for",
              })}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-8 flex justify-center">
            <EnhancedSearchBar
              onSearch={handleSearch}
              placeholder="Search products, standards, and resources..."
              autoFocus={!query}
            />
          </div>

          {/* Search Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="lg:sticky lg:top-8">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden w-full mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-left"
                >
                  Filters {facets.length > 0 && `(${facets.length})`}
                </button>
                
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                  {/* Simple Filters */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Filters
                    </h3>
                    
                    {/* Categories */}
                    {facets.find(f => f.name === 'category') && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Categories
                        </h4>
                        <div className="space-y-2">
                          {facets.find(f => f.name === 'category')?.values.slice(0, 5).map((value) => (
                            <label key={value.value} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={(filters.category || []).includes(value.value)}
                                onChange={(e) => {
                                  const currentCategories = filters.category || [];
                                  const newCategories = e.target.checked
                                    ? [...currentCategories, value.value]
                                    : currentCategories.filter(c => c !== value.value);
                                  handleFilterChange({
                                    ...filters,
                                    category: newCategories.length > 0 ? newCategories : undefined
                                  });
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex-1">
                                {value.value}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({value.count})
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clear Filters */}
                    {(filters.category?.length || filters.priceRange || filters.inStock) && (
                      <button
                        onClick={() => updateFilters({})}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:w-3/4">
              {query && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Search Results for "{query}"
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {totalCount} results found
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-200">
                    Error loading search results. Please try again.
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {results.map((product: any) => (
                    <div
                      key={product._id}
                      className="group transform transition-transform duration-300 hover:scale-105"
                    >
                      <ProductListItem product={product} />
                    </div>
                  ))}
                </div>
              ) : query ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No results found for "{query}". Try different search terms.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Start searching
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter a search term to find products and standards.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
