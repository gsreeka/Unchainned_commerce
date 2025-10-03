import { useMemo } from 'react';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { LocalState } from '@apollo/client/local-state';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import typePolicies from './typepolicies';
import possibleTypes from '../../possibleTypes.json';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient;

// Use the GraphQL endpoint
const GRAPHQL_ENDPOINT = 'http://localhost:3001/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include', // Changed from 'same-origin' to 'include' for cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

function createApolloClient({ locale } = { locale: null }) {
  const authMiddleware = new ApolloLink((operation, forward) => {
    // Get the authentication token from local storage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Set the authorization header if token exists
    const headers = {
      ...(locale && { 'accept-language': locale }),
      ...(token && { 'Authorization': `JWT ${token}` }),
    };
    
    operation.setContext({ 
      headers,
      // Ensure we're not using the cache for auth-related operations
      fetchPolicy: 'network-only',
    });
    return forward(operation);
  });

  const cache = new InMemoryCache({
    possibleTypes,
    typePolicies: {
      ...typePolicies,
      Query: {
        ...(typePolicies?.Query || {}),
        fields: {
          ...(typePolicies?.Query?.fields || {}),
          me: {
            merge: true, // This ensures the me query is properly merged
          },
        },
      },
    },
  });

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authMiddleware, httpLink]),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });

  // Initialize the cache with the user data if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      // This will trigger a refetch of the current user
      client.resetStore().catch(() => {
        // Clear the token if it's invalid
        localStorage.removeItem('token');
      });
    }
  }

  return client;
}

export function initializeApollo(
  initialState = null,
  { locale } = { locale: null },
) {
  const tempApolloClient =
    apolloClient ??
    createApolloClient({
      locale,
    });

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = tempApolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s)),
        ),
      ],
    });

    // Restore the cache with the merged data
    tempApolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return tempApolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = tempApolloClient;

  return tempApolloClient;
}

export function addApolloState(client, pageProps) {
  const newProps = { ...pageProps };
  if (newProps?.props) {
    newProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return newProps;
}

export function useApollo(pageProps, options) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo(state, options),
    [state, options],
  );
  return store;
}
