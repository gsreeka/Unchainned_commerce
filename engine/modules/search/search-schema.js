import { gql } from 'apollo-server-express';

export const searchTypeDefs = gql`
  type SearchResult {
    id: ID!
    title: String!
    description: String
    type: SearchResultType!
    url: String!
    imageUrl: String
    score: Float
    highlights: [String!]!
    category: String
    price: Float
    manufacturer: String
  }

  type SearchFacet {
    name: String!
    values: [SearchFacetValue!]!
  }

  type SearchFacetValue {
    value: String!
    count: Int!
  }

  type SearchResponse {
    results: [SearchResult!]!
    totalCount: Int!
    facets: [SearchFacet!]!
    suggestions: [String!]!
  }

  type SearchSuggestionResponse {
    suggestions: [String!]!
    products: [SearchProductSuggestion!]!
  }

  type SearchProductSuggestion {
    id: ID!
    title: String!
    imageUrl: String
    price: Float
  }

  type SearchAutocompleteResponse {
    completions: [String!]!
    categories: [String!]!
    manufacturers: [String!]!
  }

  type PopularSearch {
    term: String!
    count: Int!
  }

  enum SearchResultType {
    PRODUCT
    STANDARD
    DOCUMENT
    NEWS
  }

  input SearchFiltersInput {
    category: [String!]
    priceRange: PriceRangeInput
    manufacturer: [String!]
    type: [String!]
    inStock: Boolean
  }

  input PriceRangeInput {
    min: Float!
    max: Float!
  }

  extend type Query {
    azureSearch(
      query: String!
      filters: SearchFiltersInput
      page: Int = 1
      limit: Int = 20
    ): SearchResponse!

    searchSuggestions(query: String!): SearchSuggestionResponse!
    
    searchAutocomplete(query: String!): SearchAutocompleteResponse!
    
    popularSearches(limit: Int = 10): [PopularSearch!]!
  }

  extend type Mutation {
    indexProduct(productId: ID!): Boolean!
    reindexAllProducts: Boolean!
    deleteFromIndex(documentId: ID!): Boolean!
  }
`;
