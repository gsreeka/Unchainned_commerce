import { gql, OperationVariables } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAppContext } from '../../common/components/AppContextWrapper';
import isEmail from '../../common/utils/isEmail';

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

interface LoginResponse {
  loginWithPassword: {
    _id: string;
  } | null;
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

  const logInWithPassword = async ({ 
    usernameOrEmail, 
    password,
    disableHashing 
  }: { 
    usernameOrEmail: string; 
    password: string;
    disableHashing?: boolean;
  }) => {
    try {
      console.group('Login Debug');
      console.log('Login attempt started for:', usernameOrEmail);
      console.log('emailSupportDisabled:', emailSupportDisabled);
      console.log('isEmail result:', isEmail(usernameOrEmail));
      
      const variables: LoginVariables = {
        plainPassword: password.trim(),
      };

      // Always use email if it's a valid email format, regardless of emailSupportDisabled
      if (isEmail(usernameOrEmail)) {
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

      // Handle GraphQL errors first (these come through the errorPolicy: 'all' setting)
      // Note: With errorPolicy: 'all', GraphQL errors don't throw but are included in the result

      // Handle the response
      const loginData = result.data?.loginWithPassword;
      if (loginData && loginData._id) {
        console.log('Login successful, user ID:', loginData._id);
        
        try {
          // Authentication is handled via cookies/sessions
          // Reset Apollo cache to refetch user data with new authentication state
          if (client) {
            await client.resetStore();
            console.log('Login successful - Apollo cache reset');
          }
          
          return { 
            data: loginData, 
            errors: [] 
          };
        } catch (resetError) {
          console.error('Error resetting Apollo store:', resetError);
          return { 
            data: null, 
            errors: [{ message: 'Failed to complete login process. Please try again.' }]
          };
        }
      } else if (loginData === null) {
        // This means authentication failed
        const errorMessage = 'Invalid credentials provided';
        console.error(errorMessage);
        return { data: null, errors: [{ message: errorMessage }] };
      } else {
        const errorMessage = 'Login failed - no user data received';
        console.error(errorMessage);
        return { data: null, errors: [{ message: errorMessage }] };
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
      
      return { data: null, errors: [{ message: errorMessage }] };
    } finally {
      console.groupEnd();
    }
  };

  return { logInWithPassword };
};

export default useLoginWithPassword;