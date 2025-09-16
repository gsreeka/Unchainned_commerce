import {ApolloClient,  InMemoryCache,  createHttpLink, } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

import StoreApp from "./storeapp";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <StoreApp />
    </ApolloProvider>
  );
}
