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
    // Reset the Apollo store to clear cached user data
    // Authentication cookies will be cleared by the server or expire naturally
    if (apolloClient) {
      await apolloClient.resetStore();
    }

    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

export default logOut;