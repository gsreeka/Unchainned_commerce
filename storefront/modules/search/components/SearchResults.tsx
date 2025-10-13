"use client";
import React from 'react';
import { SearchResult, SearchFacet } from '../hooks/useAzureSearch';
import { DocumentIcon, CubeIcon, NewspaperIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultsProps {
  results: SearchResult[];
  totalCount: number;
  loading: boolean;
  query: string;
  facets: SearchFacet[];
  onFilterChange?: (filters: any) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  totalCount,
  loading,
  query,
  facets,
  onFilterChange
}) => {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return <CubeIcon className="h-5 w-5 text-blue-500" />;
      case 'STANDARD':
        return <AcademicCapIcon className="h-5 w-5 text-green-500" />;
      case 'DOCUMENT':
        return <DocumentIcon className="h-5 w-5 text-purple-500" />;
      case 'NEWS':
        return <NewspaperIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return 'Product';
      case 'STANDARD':
        return 'Standard';
      case 'DOCUMENT':
        return 'Document';
      case 'NEWS':
        return 'News';
      default:
        return 'Result';
    }
  };

  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    });
    
    return highlightedText;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No results found
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          No results found for "{query}". Try adjusting your search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      {query && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Search Results
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalCount.toLocaleString()} results for "{query}"
          </p>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <Link href={result.url} className="block p-6">
              <div className="flex items-start space-x-4">
                {/* Result Image */}
                {result.imageUrl && (
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={result.imageUrl}
                        alt={result.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </div>
                )}

                {/* Result Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getResultIcon(result.type)}
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {getResultTypeLabel(result.type)}
                    </span>
                    {result.category && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {result.category}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(result.title, result.highlights)
                      }}
                    />
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(result.description, result.highlights)
                      }}
                    />
                  </p>

                  {/* Result Metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      {result.manufacturer && (
                        <span>By {result.manufacturer}</span>
                      )}
                      {result.score && (
                        <span>Relevance: {Math.round(result.score * 100)}%</span>
                      )}
                    </div>
                    
                    {result.price && (
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        ${result.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {results.length < totalCount && (
        <div className="text-center pt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
