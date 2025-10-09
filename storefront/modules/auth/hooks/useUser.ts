import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
 
interface Email {
  address: string;
  verified: boolean;
}
 
interface User {
  _id: string;
  username?: string;
  emails?: Email[];
  name?: string;
  isGuest?: boolean;
  roles?: string[];
  profile?: {
    phoneMobile?: string;
  };
  cart?: {
    _id: string;
    items: Array<{
      _id: string;
      quantity: number;
      total: {
        amount: number;
        currencyCode: string;
      };
      unitPrice: {
        amount: number;
        currencyCode: string;
      };
      product: {
        _id: string;
        texts: {
          title: string;
          subtitle: string;
        };
        media: Array<{
          _id: string;
          file: {
            url: string;
          };
        }>;
      };
    }>;
    itemsTotal?: {
      amount: number;
      currencyCode: string;
    };
  };
}
 
interface UserData {
  me: User | null;
}
 
export const USER_QUERY = gql`
  query MinimalUserQuery {
    me {
      _id
      username
      emails {
        address
        verified
      }
      isGuest
      cart {
        _id
        items {
          _id
          quantity
          total {
            amount
            currencyCode
          }
          unitPrice {
            amount
            currencyCode
          }
          product {
            _id
            texts {
              title
              subtitle
            }
            media {
              _id
              file {
                url
              }
            }
          }
        }
        itemsTotal: total(category: ITEMS) {
          amount
          currencyCode
        }
        total {
          amount
          currencyCode
        }
      }
    }
  }
`;
 
const useUser = () => {
  const { data, loading, error, refetch, client } = useQuery<UserData>(USER_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });
 
  // Handle errors
  useEffect(() => {
    if (!error) return;
   
    console.error('User query error:', error);
   
    // Type assertion for Apollo error
    const apolloError = error as any;
   
    // Check if this is an authentication error
    const graphQLErrors = apolloError.graphQLErrors || [];
    const networkError = apolloError.networkError;
   
    const isUnauthenticated =
      graphQLErrors.some((e: any) =>
        e?.extensions?.code === 'UNAUTHENTICATED' ||
        e?.message?.includes('Not authorized')
      ) ||
      error.message.includes('401') ||
      (networkError as any)?.statusCode === 401;
   
    if (isUnauthenticated && typeof window !== 'undefined') {
      console.log('Clearing invalid token due to authentication error');
      localStorage.removeItem('token');
      client.clearStore().catch(console.error);
    }
  }, [error, client]);
 
  // Handle initial load and token changes
  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        console.log('No auth token found');
        return;
      }
 
      try {
        console.log('Refreshing user data...');
        await refetch();
      } catch (err) {
        console.error('Error refreshing user data:', err);
        // If there's an error, clear the token and reset the store
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          client.clearStore().catch(console.error);
        }
      }
    };
 
    // Check auth on mount
    checkAuth();
   
    // Also check auth when the window regains focus (in case of token changes in other tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };
   
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetch, client]);
 
  return {
    user: data?.me || null,
    loading,
    error,
    refetch,
  };
};
 
export default useUser;