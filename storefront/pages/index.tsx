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
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative w-screen ml-[calc(-50vw+50%)]"
        >
          <div className="relative h-[60vh] lg:h-[40vh] xl:h-[25vh] w-full">
            <Image
              src="placeholder.png"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              quality={100}
              alt={formatMessage({ id: 'hero', defaultMessage: 'Hero' })}
              loader={defaultNextImageLoader}
              priority
            />
            <div className="absolute inset-0 bg-slate-950 bg-opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-2 text-center text-white">
                <h1 className="mb-4 text-4xl text-white/50 font-semibold tracking-tight sm:text-5xl">
                  {formatMessage({
                    id: 'hero_title',
                    defaultMessage: 'Ecommerce Starter Template',
                  })}
                </h1>
                <p className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {formatMessage({
                    id: 'hero_subtitle',
                    defaultMessage: 'Powered by Unchained and Next.js',
                  })}
                </p>
                <a
                  href="https://github.com/unchainedshop/storefront"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-3 py-1.5 text-base font-medium rounded-md text-slate-50 hover:text-white border-2 border-slate-800 hover:border-slate-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  {formatMessage({
                    id: 'view_on_github',
                    defaultMessage: 'View on GitHub',
                  })}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                {formatMessage({
                  id: 'browse_categories',
                  defaultMessage: 'Browse Categories',
                })}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {formatMessage({
                  id: 'categories_subtitle',
                  defaultMessage: 'Explore our wide range of product categories',
                })}
              </p>
            </div>

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
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
                    {assortments.map((category) => (
                      <div 
                        key={category._id} 
                        className={viewMode === 'list' ? 'group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-slate-900 dark:border-0' : 'group relative'}
                      >
                        {viewMode === 'list' ? (
                          <div className="lg:flex gap-5">
                            <div className="w-full h-100 lg:h-64 lg:w-48 flex-shrink-0 relative overflow-hidden bg-white dark:bg-slate-700 p-4 flex items-center justify-center">
                              {category.media?.[0]?.url ? (
                                <img
                                  src={category.media[0].url}
                                  alt={category.texts?.title}
                                  className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:opacity-75"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <div className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                  {category.texts?.title}
                                </h3>
                                {category.texts?.subtitle && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    {category.texts.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <CategoryList categories={[category]} viewMode="grid" />
                        )}
                      </div>
                    ))}
                  </div>
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
