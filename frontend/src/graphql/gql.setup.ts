import { ApolloClient, InMemoryCache } from "@apollo/client";
import { API_URL } from "@/APIUrl";
export const graphqlClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});
