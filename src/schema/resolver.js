import fetch from "node-fetch";

export const resolvers = {
  Query: {
    async fetchPokemon(_, { pokemonName }) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      if (!response.ok) {
        throw new Error(`Pokémon "${pokemonName}" not found`);
      }

      const data = await response.json();

      return {
        name: data.name,
        types: data.types,
      };
    },
  },
};
