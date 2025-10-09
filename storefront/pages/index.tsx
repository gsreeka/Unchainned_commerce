import { useIntl } from 'react-intl';
import { useState } from 'react';

import Image from 'next/image';

import MetaTags from '../modules/common/components/MetaTags';
import defaultNextImageLoader from '../modules/common/utils/defaultNextImageLoader';
import useProducts from '../modules/products/hooks/useProducts';
import useAssortments from '../modules/assortment/hooks/useAssortments';
import ProductList from '../modules/products/components/ProductList';
import CategoryList from '../modules/assortment/components/CategoryList';
import Loading from '../modules/common/components/Loading';
import ListViewWrapper from '../modules/common/components/ListViewWrapper';
import AdvertisementCarousel from '../modules/common/components/AdvertisementCarousel';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/20/solid';

const Home = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts({ limit: 20 });
  const { assortments, loading: assortmentsLoading } = useAssortments({
    includeLeaves: true,
  });
  const { formatMessage } = useIntl();
  const [categoryViewMode, setCategoryViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <>
      <MetaTags title={formatMessage({ id: 'home', defaultMessage: 'Home' })} />
      <div className="min-h-screen bg-white">
        {/* Advertisement Carousel Section */}
        <section className="w-screen ml-[calc(-50vw+50%)] mb-8">
          <AdvertisementCarousel
            autoPlay={true}
            slideInterval={4000}
            showThumbnails={false}
            showBullets={true}
            showNav={true}
            limit={3}
            className="shadow-lg"
          />
        </section>

        {/* Categories Section - Placed directly below header */}
        <section className="py-16 bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {assortmentsLoading ? (
              <Loading />
            ) : (
              <ListViewWrapper
                title={formatMessage({
                  id: 'browse_categories',
                  defaultMessage: 'Browse Categories',
                })}
                subtitle={formatMessage({
                  id: 'categories_subtitle',
                  defaultMessage: 'Explore our wide range of product categories',
                })}
                storageKey="categoryViewMode"
              >
                {(viewMode) => (
                  <CategoryList categories={assortments} viewMode={viewMode} />
                )}
              </ListViewWrapper>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="w-screen ml-[calc(-50vw+50%)] py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
          <div className="container px-6 lg:px-8 mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                {formatMessage({
                  id: 'all_products',
                  defaultMessage: 'All Products',
                })}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {formatMessage({
                  id: 'products_subtitle',
                  defaultMessage: 'Discover our complete collection',
                })}
              </p>
            </div>

            {productsLoading ? (
              <Loading />
            ) : productsError ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">
                  Error loading products: {productsError.message}
                </p>
              </div>
            ) : products.length > 0 ? (
              <ListViewWrapper>
                {(viewMode) => (
                  <ProductList
                    products={products}
                    totalProducts={products.length}
                    viewMode={viewMode}
                    onLoadMore={() => {
                      // Load more functionality would be implemented here
                      // For now, this is a placeholder since the home page shows a fixed set
                    }}
                  />
                )}
              </ListViewWrapper>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  {formatMessage({
                    id: 'no_products',
                    defaultMessage: 'No products available',
                  })}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
