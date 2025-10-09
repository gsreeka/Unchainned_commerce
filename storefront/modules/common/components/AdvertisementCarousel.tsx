import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useAdvertisements, { Advertisement } from '../hooks/useAdvertisements';
import Loading from './Loading';
import 'react-image-gallery/styles/css/image-gallery.css';

interface AdvertisementCarouselProps {
  advertisements?: Advertisement[];
  autoPlay?: boolean;
  slideInterval?: number;
  showThumbnails?: boolean;
  showBullets?: boolean;
  showNav?: boolean;
  className?: string;
  limit?: number;
}

const AdvertisementCarousel: React.FC<AdvertisementCarouselProps> = ({
  advertisements: providedAdvertisements,
  autoPlay = true,
  slideInterval = 5000,
  showThumbnails = false,
  showBullets = true,
  showNav = true,
  className = '',
  limit = 4,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use the hook to fetch advertisements if none are provided
  const { 
    advertisements: fetchedAdvertisements, 
    loading, 
    error 
  } = useAdvertisements({ 
    limit, 
    activeOnly: true 
  });
  
  // Use provided advertisements or fallback to fetched ones
  const advertisements = providedAdvertisements || fetchedAdvertisements;
  const activeAds = advertisements.filter(ad => ad.isActive);

  // Show loading state
  if (loading && !providedAdvertisements) {
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
        <Loading />
      </div>
    );
  }

  // Show error state
  if (error && !providedAdvertisements) {
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Failed to load advertisements</p>
      </div>
    );
  }

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };

  const handleAdClick = (ad: Advertisement) => {
    if (ad.linkUrl) {
      window.open(ad.linkUrl, '_self');
    }
  };

  // Custom render function for slides
  const renderItem = (item: any) => {
    const ad = activeAds[item.index];
    
    return (
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row min-h-[300px]">
          {/* Image Section - Left Side */}
          <div className="w-full md:w-1/2 relative">
            <img
              src={item.original}
              alt={item.originalAlt}
              className="w-full h-full object-cover"
              style={{ minHeight: '300px' }}
            />
          </div>
          
          {/* Content Section - Right Side */}
          <div className="w-full md:w-1/2 relative bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
            
            {/* Content */}
            <div className="relative flex items-center h-full p-6 md:p-8 lg:p-12" style={{ minHeight: '300px' }}>
              <div className="text-gray-800 max-w-lg">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                  {ad.title}
                </h2>
                {ad.description && (
                  <p className="text-base md:text-lg mb-6 text-gray-700 leading-relaxed">
                    {ad.description}
                  </p>
                )}
                {ad.ctaText && ad.linkUrl && (
                  <button
                    onClick={() => handleAdClick(ad)}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-colors duration-200 text-base md:text-lg shadow-md hover:shadow-lg"
                  >
                    {ad.ctaText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Custom navigation arrows
  const renderLeftNav = (onClick: () => void, disabled: boolean) => (
    <button
      className="image-gallery-icon image-gallery-left-nav absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
      disabled={disabled}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <ChevronLeftIcon className="w-6 h-6 text-white" />
    </button>
  );

  const renderRightNav = (onClick: () => void, disabled: boolean) => (
    <button
      className="image-gallery-icon image-gallery-right-nav absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
      disabled={disabled}
      onClick={onClick}
      aria-label="Next slide"
    >
      <ChevronRightIcon className="w-6 h-6 text-white" />
    </button>
  );

  // Prepare images for react-image-gallery
  const images = activeAds.map((ad, index) => ({
    original: ad.imageUrl,
    thumbnail: ad.imageUrl,
    originalAlt: ad.title,
    thumbnailAlt: ad.title,
    index,
  }));

  if (activeAds.length === 0) {
    return null;
  }

  return (
    <div className={`advertisement-carousel ${className}`}>
      <style jsx global>{`
        .advertisement-carousel .image-gallery {
          background: transparent;
        }
        
        .advertisement-carousel .image-gallery-slide {
          background: transparent;
          height: auto !important;
          min-height: 300px;
        }
        
        .advertisement-carousel .image-gallery-slide .image-gallery-image {
          height: auto !important;
          max-height: none !important;
        }
        
        .advertisement-carousel .image-gallery-bullets {
          bottom: 20px;
        }
        
        .advertisement-carousel .image-gallery-bullet {
          background-color: rgba(30, 58, 138, 0.5);
          border: 2px solid rgba(30, 58, 138, 0.8);
        }
        
        .advertisement-carousel .image-gallery-bullet.active {
          background-color: rgb(30, 58, 138);
        }
        
        .advertisement-carousel .image-gallery-thumbnails {
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .advertisement-carousel .image-gallery-thumbnail {
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .advertisement-carousel .image-gallery-thumbnail.active {
          border-color: rgb(30, 58, 138);
        }
      `}</style>
      
      <ImageGallery
        items={images}
        showThumbnails={showThumbnails}
        showBullets={showBullets}
        showNav={showNav}
        autoPlay={autoPlay}
        slideInterval={slideInterval}
        slideDuration={450}
        onSlide={handleSlideChange}
        renderItem={renderItem}
        renderLeftNav={showNav ? renderLeftNav : undefined}
        renderRightNav={showNav ? renderRightNav : undefined}
        showPlayButton={false}
        showFullscreenButton={false}
        useBrowserFullscreen={false}
        additionalClass="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default AdvertisementCarousel;
