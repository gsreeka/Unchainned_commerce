import { useState, useEffect } from 'react';

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  ctaText?: string;
  isActive: boolean;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
}

interface UseAdvertisementsOptions {
  limit?: number;
  activeOnly?: boolean;
}

interface UseAdvertisementsReturn {
  advertisements: Advertisement[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Mock data - in a real application, this would come from your backend
const mockAdvertisements: Advertisement[] = [
  {
    id: '1',
    title: 'NEMA\'s Guide to the Electrical Industry',
    description: 'Comprehensive guide to electrical industry standards and best practices',
    imageUrl: '/caraousal/NEMAsGuidetotheElectroindustry.jpg',
    linkUrl: '/shop',
    ctaText: 'Learn More',
    isActive: true,
    priority: 1,
  },
  {
    id: '2',
    title: 'Distribution Equipment',
    description: 'High-quality electrical distribution equipment for all your needs',
    imageUrl: '/caraousal/distribution-equipment.jpg',
    linkUrl: '/shop',
    ctaText: 'Shop Now',
    isActive: true,
    priority: 2,
  },
  {
    id: '3',
    title: 'Industrial Controls',
    description: 'Advanced industrial control systems and automation solutions',
    imageUrl: '/caraousal/industrial-controls.jpg',
    linkUrl: '/shop',
    ctaText: 'Explore',
    isActive: true,
    priority: 3,
  },
  {
    id: '4',
    title: 'Electrical Enclosures',
    description: 'Durable and reliable electrical enclosures for protection',
    imageUrl: '/caraousal/enclosures.jpg',
    linkUrl: '/shop',
    ctaText: 'View Products',
    isActive: true,
    priority: 4,
  },
  {
    id: '5',
    title: 'Motors & Drives',
    description: 'Efficient motors and drive systems for industrial applications',
    imageUrl: '/caraousal/motors.jpg',
    linkUrl: '/shop',
    ctaText: 'Shop Motors',
    isActive: true,
    priority: 5,
  },
  {
    id: '6',
    title: 'LED Lighting Solutions',
    description: 'Energy-efficient LED lighting for commercial and industrial use',
    imageUrl: '/caraousal/lighting.jpg',
    linkUrl: '/shop',
    ctaText: 'Browse Lighting',
    isActive: true,
    priority: 6,
  },
  {
    id: '7',
    title: 'Medical Imaging Equipment',
    description: 'Precision medical imaging solutions for healthcare facilities',
    imageUrl: '/caraousal/medical-imaging.jpg',
    linkUrl: '/shop',
    ctaText: 'Learn More',
    isActive: true,
    priority: 7,
  },
  {
    id: '8',
    title: 'Safety Standards Z535',
    description: 'Comprehensive safety signage and labeling standards',
    imageUrl: '/caraousal/z535.jpg',
    linkUrl: '/shop',
    ctaText: 'View Standards',
    isActive: true,
    priority: 8,
  },
  {
    id: '9',
    title: 'ESPG 2022 Conference',
    description: 'Join us for the latest in electrical safety and standards',
    imageUrl: '/caraousal/espg2022.jpg',
    linkUrl: '/shop',
    ctaText: 'Register Now',
    isActive: true,
    priority: 9,
  },
];

const useAdvertisements = (
  options: UseAdvertisementsOptions = {}
): UseAdvertisementsReturn => {
  const { limit, activeOnly = true } = options;
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredAds = [...mockAdvertisements];

      // Filter active advertisements
      if (activeOnly) {
        filteredAds = filteredAds.filter(ad => ad.isActive);
      }

      // Sort by priority
      filteredAds.sort((a, b) => (a.priority || 0) - (b.priority || 0));

      // Apply limit
      if (limit) {
        filteredAds = filteredAds.slice(0, limit);
      }

      setAdvertisements(filteredAds);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch advertisements'));
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAdvertisements();
  };

  useEffect(() => {
    fetchAdvertisements();
  }, [limit, activeOnly]);

  return {
    advertisements,
    loading,
    error,
    refetch,
  };
};

export default useAdvertisements;
