import { gql } from "graphql-tag";

// GraphQL schema definition (the "shape" of the data and available queries)
export const typeDefs = gql`
  type Pokemon {
    name: String
    types: [PokemonType]
  }

  type TypeInfo {
    name: String
    url: String
  }

  type PokemonType {
    slot: Int
    type: TypeInfo
  }

  type Query {
    fetchPokemon(pokemonName: String): Pokemon
  }
`;
