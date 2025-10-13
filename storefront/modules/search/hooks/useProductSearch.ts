import { useState, useEffect, useMemo } from 'react';
import useProducts from '../../products/hooks/useProducts';
import useAssortments from '../../assortment/hooks/useAssortments';

interface SearchFilters {
  category?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
}

interface UseProductSearchOptions {
  autoSearch?: boolean;
  debounceMs?: number;
}

export const useProductSearch = (
  initialQuery: string = '',
  initialFilters: SearchFilters = {},
  options: UseProductSearchOptions = {}
) => {
  const { autoSearch = true, debounceMs = 300 } = options;
  
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Fetch all products and categories
  const { products, loading: productsLoading, error: productsError } = useProducts({ limit: 1000 });
  const { assortments, loading: assortmentsLoading } = useAssortments({ includeLeaves: true });

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  // Filter and search products
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    const searchTerm = debouncedQuery.toLowerCase();
    
    return products.filter((product: any) => {
      // Text-based search
      const title = product.texts?.title?.toLowerCase() || '';
      const description = product.texts?.description?.toLowerCase() || '';
      const brand = product.texts?.brand?.toLowerCase() || '';
      const vendor = product.texts?.vendor?.toLowerCase() || '';
      
      const matchesSearch = 
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        brand.includes(searchTerm) ||
        vendor.includes(searchTerm);

      if (!matchesSearch) return false;

      // Category filter
      if (filters.category && filters.category.length > 0) {
        const productCategories = product.assortmentPaths?.map((path: any) => 
          path.links?.[0]?.assortment?.texts?.title
        ).filter(Boolean) || [];
        
        const hasMatchingCategory = filters.category.some(filterCategory =>
          productCategories.some((productCategory: string) =>
            productCategory?.toLowerCase().includes(filterCategory.toLowerCase())
          )
        );
        
        if (!hasMatchingCategory) return false;
      }

      // Price filter
      if (filters.priceRange) {
        const price = product.simulatedPrice?.price?.amount || 0;
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // Stock filter
      if (filters.inStock) {
        // Assuming products have stock information - adjust based on your schema
        const inStock = product.stock?.quantity > 0 || true; // Default to true if no stock info
        if (!inStock) return false;
      }

      return true;
    });
  }, [products, debouncedQuery, filters]);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    const suggestions = new Set<string>();
    
    // Add product titles that match
    products.forEach((product: any) => {
      const title = product.texts?.title || '';
      if (title.toLowerCase().includes(searchTerm)) {
        suggestions.add(title);
      }
    });
    
    // Add brand names that match
    products.forEach((product: any) => {
      const brand = product.texts?.brand || '';
      if (brand && brand.toLowerCase().includes(searchTerm)) {
        suggestions.add(brand);
      }
    });

    // Add vendor names that match
    products.forEach((product: any) => {
      const vendor = product.texts?.vendor || '';
      if (vendor && vendor.toLowerCase().includes(searchTerm)) {
        suggestions.add(vendor);
      }
    });

    // Add category names that match
    products.forEach((product: any) => {
      product.assortmentPaths?.forEach((path: any) => {
        const categoryName = path.links?.[0]?.assortment?.texts?.title || '';
        if (categoryName && categoryName.toLowerCase().includes(searchTerm)) {
          suggestions.add(categoryName);
        }
      });
    });

    // Add common search terms if they match
    const commonTerms = ['NEMA', 'electrical', 'circuit', 'breaker', 'panel', 'switch', 'outlet', 'cable', 'wire'];
    commonTerms.forEach(term => {
      if (term.toLowerCase().includes(searchTerm)) {
        suggestions.add(term);
      }
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, [products, query]);

  // Generate facets for filtering
  const facets = useMemo(() => {
    const categoryFacet = {
      name: 'category',
      values: [] as Array<{ value: string; count: number }>
    };

    const brandFacet = {
      name: 'brand',
      values: [] as Array<{ value: string; count: number }>
    };

    // Count categories
    const categoryCount = new Map<string, number>();
    const brandCount = new Map<string, number>();

    products.forEach((product: any) => {
      // Count categories
      product.assortmentPaths?.forEach((path: any) => {
        const categoryName = path.links?.[0]?.assortment?.texts?.title;
        if (categoryName) {
          categoryCount.set(categoryName, (categoryCount.get(categoryName) || 0) + 1);
        }
      });

      // Count brands
      const brand = product.texts?.brand;
      if (brand) {
        brandCount.set(brand, (brandCount.get(brand) || 0) + 1);
      }
    });

    // Convert to facet format
    categoryFacet.values = Array.from(categoryCount.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    brandFacet.values = Array.from(brandCount.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return [categoryFacet, brandFacet].filter(facet => facet.values.length > 0);
  }, [products]);

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({});
  };

  return {
    // State
    query,
    filters,
    results: searchResults,
    totalCount: searchResults.length,
    facets,
    suggestions,
    loading: productsLoading || assortmentsLoading,
    error: productsError,
    
    // Actions
    updateQuery,
    updateFilters,
    clearSearch
  };
};
