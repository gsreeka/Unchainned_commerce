// import { ApolloClient, gql } from '@apollo/client';

// export const LOGOUT_MUTATION = gql`
//   mutation Logout {
//     logout {
//       success
//     }
//   }
// `;

// const logOut = async (apollo: ApolloClient) => {
//   await apollo.mutate({
//     mutation: LOGOUT_MUTATION,
//     awaitRefetchQueries: true,
//   });
//   await apollo.resetStore();
// };

// export default logOut;
// storefront/modules/auth/hooks/logOut.ts
import type { ApolloClient } from '@apollo/client';

const logOut = async (apolloClient: any) => {
  try {
    // Clear the token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    // Reset the Apollo store
    if (apolloClient) {
      await apolloClient.resetStore();
    }

    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if there's an error, we want to clear the token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return false;
  }
};

export default logOut;