import { PhotoIcon } from '@heroicons/react/20/solid';
import Image from 'next/legacy/image';
import Link from 'next/link';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';

import getMediaUrl from '../../common/utils/getMediaUrl';

const CategoryListItem = ({ category }) => {
  const mediaUrl = getMediaUrl(category);

  return (
    <div className="group relative">
      <Link href={`shop/${category?.texts?.slug}`} className="block">
        <div className="aspect-[3/4] overflow-hidden rounded bg-white flex items-center justify-center p-2">
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt={category?.texts?.title}
              className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:opacity-75"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PhotoIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {category.texts?.title}
          </h3>
          {category.texts?.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {category.texts.subtitle}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CategoryListItem;
