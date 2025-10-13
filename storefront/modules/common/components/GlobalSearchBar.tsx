"use client";
import React from 'react';
import { useRouter } from 'next/router';
import EnhancedSearchBar from '../../search/components/EnhancedSearchBar';

interface GlobalSearchBarProps {
  className?: string;
}

const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ className = "" }) => {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`max-w-md ${className}`}>
      <EnhancedSearchBar
        onSearch={handleSearch}
        placeholder="Search products..."
        showSuggestions={true}
        className="w-full"
      />
    </div>
  );
};

export default GlobalSearchBar;
