import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { useState, useEffect } from 'react';

import { Bars3Icon } from '@heroicons/react/20/solid';
import LoginCart from '../../auth/components/LoginCart';
import SideCart from '../../cart/components/SideCart';

import { useAppContext } from '../../common/components/AppContextWrapper';

interface HeaderProps {
  onSidebarToggle: () => void;
  hasHeroSection?: boolean;
  heroSectionId?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSidebarToggle,
  hasHeroSection = false,
  heroSectionId = 'hero-section',
}) => {
  const { isCartOpen } = useAppContext();
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(hasHeroSection);

  useEffect(() => {
    if (!hasHeroSection) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Simple threshold - if scrolled more than 100px, switch to white header
      if (scrollY > 100) {
        setIsScrolled(true);
        setIsOverHero(false);
      } else {
        setIsScrolled(false);
        setIsOverHero(true);
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasHeroSection]);

  // Simplified styling logic
  const isHeroMode = hasHeroSection && isOverHero && !isScrolled;
  return (
    <header className="sticky top-0 z-[1020] bg-blue-900 text-white print:hidden">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              aria-label="menu"
              className="rounded-md p-2 text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
              onClick={onSidebarToggle}
            >
              <Bars3Icon className="h-8 w-8" />
            </button>
          </div>

          {/* Logo and Title */}
          <div className="flex-1">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative h-20 w-40">
                <Image
                  src="/Screenshot 2025-10-01 171603.png"
                  alt="NEMA Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100px, 160px"
                  priority
                />
              </div>
              <div className="text-left text-white">
                <div className="text-lg font-medium leading-tight">The National Electrical</div>
                <div className="text-lg font-medium leading-tight">Manufacturers Association</div>
              </div>
            </Link>
          </div>

          {/* Cart and Login */}
          <div className="[&_*]:text-white [&_button]:text-white/80 [&_button:hover]:text-white [&_a]:text-white/80 [&_a:hover]:text-white">
            <LoginCart />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
