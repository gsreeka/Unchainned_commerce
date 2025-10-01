import React from 'react';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/20/solid';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex justify-end mb-6 bg-red-100 p-4">
      <div className="text-sm text-red-600 mr-4">View Toggle Component - Current: {viewMode}</div>
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'grid'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="Grid View"
        >
          <Squares2X2Icon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'list'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="List View"
        >
          <ListBulletIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
