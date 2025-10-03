import { gql, OperationVariables } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, any>;
}

interface GraphQLResponseError {
  graphQLErrors: ReadonlyArray<GraphQLError>;
  networkError?: Error | null;
  message: string;
}
import { useAppContext } from '../../common/components/AppContextWrapper';
import isEmail from '../../common/utils/isEmail';

interface UserEmail {
  address: string;
  verified: boolean;
}

interface LoggedInUser {
  _id: string;
  username: string;
  emails: UserEmail[];
  roles: string[];
}

interface LoginResponse {
  loginWithPassword: {
    _id: string;
    token: string;
    tokenExpires: string;
    user: {
      _id: string;
      username: string;
      roles: string[];
    };
  };
}

interface LoginVariables extends OperationVariables {
  username?: string;
  email?: string;
  plainPassword: string;
}

const LOG_IN_WITH_PASSWORD_MUTATION = gql`
  mutation LoginWithPassword(
    $username: String
    $email: String
    $plainPassword: String!
  ) {
    loginWithPassword(
      username: $username
      email: $email
      password: $plainPassword
    ) {
      _id
      token
      tokenExpires
      user {
        _id
        username
        roles
      }
    }
  }
`;

const useLoginWithPassword = () => {
  const { emailSupportDisabled } = useAppContext();
  const [logInWithPasswordMutation, { client }] = useMutation<LoginResponse, LoginVariables>(
    LOG_IN_WITH_PASSWORD_MUTATION,
    {
      errorPolicy: 'all',
    },
  );

  const logInWithPassword = async ({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }) => {
    try {
      console.group('Login Debug');
      console.log('Login attempt started for:', usernameOrEmail);
      
      const variables: LoginVariables = {
        plainPassword: password.trim(),
      };

      if (!emailSupportDisabled && isEmail(usernameOrEmail)) {
        variables.email = usernameOrEmail.trim();
        console.log('Using email for login');
      } else {
        variables.username = usernameOrEmail.trim();
        console.log('Using username for login');
      }

      console.log('Login variables:', {
        ...variables,
        plainPassword: '[REDACTED]',
        passwordLength: password?.length
      });

      // Make the login request
      const result = await logInWithPasswordMutation({
        variables,
        fetchPolicy: 'network-only',
      });

      console.log('Login response:', result);

      // Handle the response
      const loginData = result.data?.loginWithPassword;
      if (loginData?.token) {
        console.log('Login successful, storing token');
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', loginData.token);
          console.log('Token stored in localStorage');
          
          // Force a refetch of the current user
          if (client) {
            await client.resetStore();
            console.log('Apollo cache reset');
          }
        }
        return { data: loginData, error: null };
      } else {
        const errorMessage = 'No token received from server';
        console.error(errorMessage);
        return { data: null, error: errorMessage };
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        // Handle ApolloError
        const apolloError = error as Partial<GraphQLResponseError>;
        
        if (apolloError.graphQLErrors?.length) {
          errorMessage = apolloError.graphQLErrors[0]?.message || errorMessage;
        } else if ('message' in error) {
          errorMessage = String(error.message);
        }
      }
      
      return { data: null, error: errorMessage };
    } finally {
      console.groupEnd();
    }
  };

  return { logInWithPassword };
};

export default useLoginWithPassword;
