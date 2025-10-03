import Link from 'next/link';
import { useIntl } from 'react-intl';

import {
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import OrderButton from '../../orders/components/UserOrderButton';
import useUser from '../hooks/useUser';
import { useApollo } from '../../apollo/apolloClient';
import logOut from '../hooks/logOut';
import { useAppContext } from '../../common/components/AppContextWrapper';

const LoginCart = () => {
  const { user, loading, refetch } = useUser();
  const { formatMessage } = useIntl();
  const { isCartOpen, toggleCart } = useAppContext();
  const router = useRouter();
  const apollo = useApollo({ locale: router.locale }, {});

  // Debug log user state changes
  useEffect(() => {
    console.log('LoginCart - User state changed:', { user, loading });
  }, [user, loading]);

  // Check auth state on mount and route changes
  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('Route changed - Auth check:', { hasToken: !!token, hasUser: !!user });
      
      if (token && !user && !loading) {
        console.log('Token exists but no user data, refetching...');
        try {
          await refetch();
        } catch (err) {
          console.error('Error refetching user data:', err);
        }
      }
    };

    // Initial check
    checkAuth();

    // Check on route changes
    router.events.on('routeChangeComplete', checkAuth);
    return () => {
      router.events.off('routeChangeComplete', checkAuth);
    };
  }, [user, loading, refetch, router.events]);

  const onLogout = async () => {
    await logOut(apollo);
    router.push('/login');
  };

  return (
    <div className="flex items-center gap-x-3">
      {/* Account Icon - Always visible */}
      <Link
        href={user ? "/account" : "/login"}
        className="text-white/80 hover:text-white transition-colors p-2"
        title={user ? "My Account" : "Login"}
      >
        <UserCircleIcon className="h-6 w-6" />
      </Link>

      {/* Cart Button */}
      <button
        className="relative text-white/80 hover:text-white transition-colors p-2"
        onClick={() => toggleCart(!isCartOpen)}
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {user?.cart?.items?.length ? (
          <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white">
            {user?.cart?.items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        ) : null}
      </button>

      {/* Logout Button (only for logged-in users) */}
      {user && !user.isGuest && (
        <button
          onClick={onLogout}
          className="text-white/80 hover:text-white transition-colors p-2"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default LoginCart;
