"use client";
import React, { useState } from 'react';
import { SearchFacet, SearchFilters as SearchFiltersType } from '../hooks/useAzureSearch';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchFiltersProps {
  facets: SearchFacet[];
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  facets,
  filters,
  onFiltersChange,
  className = ""
}) => {
  const [expandedFacets, setExpandedFacets] = useState<Set<string>>(new Set(['category', 'manufacturer']));
  const [priceRange, setPriceRange] = useState({
    min: filters.priceRange?.min || 0,
    max: filters.priceRange?.max || 10000
  });

  const toggleFacet = (facetName: string) => {
    const newExpanded = new Set(expandedFacets);
    if (newExpanded.has(facetName)) {
      newExpanded.delete(facetName);
    } else {
      newExpanded.add(facetName);
    }
    setExpandedFacets(newExpanded);
  };

  const handleFilterChange = (facetName: string, value: string, checked: boolean) => {
    const currentValues = filters[facetName as keyof SearchFiltersType] as string[] || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    onFiltersChange({
      ...filters,
      [facetName]: newValues.length > 0 ? newValues : undefined
    });
  };

  const handlePriceRangeChange = () => {
    onFiltersChange({
      ...filters,
      priceRange: {
        min: priceRange.min,
        max: priceRange.max
      }
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked || undefined
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    setPriceRange({ min: 0, max: 10000 });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category?.length) count += filters.category.length;
    if (filters.manufacturer?.length) count += filters.manufacturer.length;
    if (filters.type?.length) count += filters.type.length;
    if (filters.priceRange) count += 1;
    if (filters.inStock) count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* In Stock Filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              In Stock Only
            </span>
          </label>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Price Range
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                placeholder="Min"
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                placeholder="Max"
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handlePriceRangeChange}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Dynamic Facets */}
        {facets.map((facet) => (
          <div key={facet.name}>
            <button
              onClick={() => toggleFacet(facet.name)}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {facet.name.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              {expandedFacets.has(facet.name) ? (
                <ChevronUpIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedFacets.has(facet.name) && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {facet.values.slice(0, 10).map((value) => {
                  const isChecked = (filters[facet.name as keyof SearchFiltersType] as string[] || []).includes(value.value);
                  return (
                    <label key={value.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleFilterChange(facet.name, value.value, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {value.value}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({value.count})
                      </span>
                    </label>
                  );
                })}
                {facet.values.length > 10 && (
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    Show more
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.category?.map((category) => (
              <span
                key={category}
                className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full"
              >
                {category}
                <button
                  onClick={() => handleFilterChange('category', category, false)}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.manufacturer?.map((manufacturer) => (
              <span
                key={manufacturer}
                className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full"
              >
                {manufacturer}
                <button
                  onClick={() => handleFilterChange('manufacturer', manufacturer, false)}
                  className="ml-1 hover:text-green-600 dark:hover:text-green-400"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.inStock && (
              <span className="inline-flex items-center bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded-full">
                In Stock
                <button
                  onClick={() => handleInStockChange(false)}
                  className="ml-1 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
