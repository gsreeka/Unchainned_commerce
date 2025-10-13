"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useProductSearch } from '../hooks/useProductSearch';

interface EnhancedSearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  placeholder = "Search products, standards, and resources...",
  className = "",
  onSearch,
  showSuggestions = true,
  autoFocus = false
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get real suggestions from your database
  const { suggestions: realSuggestions, facets } = useProductSearch(inputValue, {}, { autoSearch: false });
  
  const filteredSuggestions = inputValue.length > 1 ? realSuggestions : [];

  // Get real categories and brands from facets
  const realCategories = inputValue.length > 1 
    ? (facets.find(f => f.name === 'category')?.values.slice(0, 3).map(v => v.value) || [])
    : [];
  
  const realManufacturers = inputValue.length > 1 
    ? (facets.find(f => f.name === 'brand')?.values.slice(0, 3).map(v => v.value) || [])
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);
    setShowDropdown(value.length > 0 && showSuggestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      performSearch(inputValue.trim());
    }
  };

  const performSearch = (query: string) => {
    setShowDropdown(false);
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    performSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const suggestions = filteredSuggestions;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setInputValue('');
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-2xl ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(inputValue.length > 0 && showSuggestions)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          
          {inputValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown with suggestions */}
      {showDropdown && (filteredSuggestions.length > 0 || realCategories.length > 0 || realManufacturers.length > 0) && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <div className="max-h-96 overflow-y-auto">
            {/* Search Completions */}
            {filteredSuggestions.length > 0 && (
              <div className="border-b border-gray-100 dark:border-gray-700">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Suggestions
                </div>
                {filteredSuggestions.slice(0, 5).map((completion, index) => (
                  <button
                    key={completion}
                    onClick={() => handleSuggestionClick(completion)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">{completion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Categories */}
            {realCategories.length > 0 && inputValue.length > 0 && (
              <div className="border-b border-gray-100 dark:border-gray-700">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Categories
                </div>
                {realCategories.slice(0, 3).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleSuggestionClick(category)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-blue-100 rounded mr-3"></div>
                      <span className="text-gray-900 dark:text-white">{category}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Manufacturers */}
            {realManufacturers.length > 0 && inputValue.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Brands
                </div>
                {realManufacturers.slice(0, 3).map((manufacturer) => (
                  <button
                    key={manufacturer}
                    onClick={() => handleSuggestionClick(manufacturer)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-green-100 rounded mr-3"></div>
                      <span className="text-gray-900 dark:text-white">{manufacturer}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
