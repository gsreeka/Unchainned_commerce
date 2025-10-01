import { useIntl } from 'react-intl';
import { PhotoIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

import CategoryListItem from './CategoryListItem';
import getMediaUrl from '../../common/utils/getMediaUrl';

const CategoryList = ({
  categories,
  viewMode = 'grid',
}) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className="mx-auto max-w-full">
        <h2 className="sr-only">
          {formatMessage({ id: 'categories', defaultMessage: 'Categories' })}
        </h2>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={`grid-${category._id}`} className="group relative">
                <CategoryListItem category={category} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <div
                key={`list-${category._id}`}
                className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-slate-900 dark:border-0"
              >
                <div className="lg:flex gap-5">
                  <div className="w-full h-100 lg:h-64 lg:w-48 flex-shrink-0 relative overflow-hidden bg-white dark:bg-slate-700 p-4 flex items-center justify-center">
                    <Link href={`shop/${category?.texts?.slug}`} className="h-full w-full flex items-center justify-center">
                      {getMediaUrl(category) ? (
                        <img
                          src={getMediaUrl(category)}
                          alt={category?.texts?.title}
                          className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:opacity-75"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PhotoIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <Link href={`shop/${category?.texts?.slug}`}>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors duration-200 hover:text-slate-700 dark:hover:text-slate-200">
                          {category?.texts?.title}
                        </h3>
                      </Link>
                      {category?.texts?.subtitle && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {category?.texts?.subtitle}
                        </p>
                      )}
                      {category?.texts?.description && (
                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {category?.texts?.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4">
                    <Link
                      href={`shop/${category?.texts?.slug}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors duration-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      {formatMessage({
                        id: 'browse_category',
                        defaultMessage: 'Browse Category',
                      })}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
