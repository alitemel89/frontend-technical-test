import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.platform.opentargets.org/api/v4/graphql',
  cache: new InMemoryCache(),
});

export default client;