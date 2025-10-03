import { useIntl } from 'react-intl';
import { PhotoIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import getMediaUrl from '../../common/utils/getMediaUrl';

const CategoryList = ({
  categories,
  viewMode = 'grid',
}) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-6">
            {categories.map((category) => (
              <div 
                key={`grid-${category._id}`}
                className="group relative bg-white dark:bg-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <Link href={`shop/${category?.texts?.slug}`} className="block">
                  <div className="w-full bg-white dark:bg-slate-800 p-1 sm:p-2 flex items-center justify-center" style={{ minHeight: '200px' }}>
                    {getMediaUrl(category) ? (
                      <img
                        src={getMediaUrl(category)}
                        alt={category?.texts?.title}
                        className="h-auto w-auto max-h-56 max-w-full object-contain object-center group-hover:opacity-90 transition-opacity duration-200"
                      />
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center rounded-md bg-gray-100 dark:bg-slate-600">
                        <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 h-10 flex items-center justify-center">
                      {category.texts?.title}
                    </h3>
                    {category.texts?.subtitle && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                        {category.texts.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={`list-${category._id}`}
                className="group relative bg-white dark:bg-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <Link href={`shop/${category?.texts?.slug}`} className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-48 flex-shrink-0 bg-white dark:bg-slate-800 p-4 flex items-center justify-center">
                    {getMediaUrl(category) ? (
                      <img
                        src={getMediaUrl(category)}
                        alt={category?.texts?.title}
                        className="h-40 w-40 object-contain object-center group-hover:opacity-90 transition-opacity duration-200"
                      />
                    ) : (
                      <div className="flex h-40 w-40 items-center justify-center rounded-md bg-gray-100 dark:bg-slate-600">
                        <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {category?.texts?.title}
                      </h3>
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
                    <div className="mt-4">
                      <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors duration-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                        {formatMessage({
                          id: 'browse_category',
                          defaultMessage: 'Browse Category',
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default CategoryList;
