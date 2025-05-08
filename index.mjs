import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { gql } from 'graphql-tag'
import fetch from "node-fetch"

const server = new ApolloServer({
    // GraphQL schema definition (the "shape" of the data and available queries)
    typeDefs: gql`
        type Ability {
            name: String
            url: String
        }

        type Abilities {
            ability: Ability
            is_hidden: Boolean
            slot: Int
        }

        type FormDetailSprites {
            front_default: String
        }

        type FormDetail {
            id: Int
            is_battle_only: Boolean
            name: String
            sprites: FormDetailSprites
        }

        type Form {
            name: String
            url: String
            detail: FormDetail
        }

        type Pokemon {
            abilities: [Abilities]
            forms: [Form]
        }

        type Query {
            fetchPokemon(pokemonName: String!): Pokemon
        }
    `,
    // Resolvers: these functions tell GraphQL how to fetch the actual data
    resolvers: {
        Query: {
            async fetchPokemon(_, { pokemonName }) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
                return response.json()
            },
        },
        Form: {
            async detail(form) {
                const detailForm = await fetch(form.url)
                return detailForm.json()
            },
        },
    }
})

// Start the Apollo server on port 4000 and wait until it's ready
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
})

// Log the server URL so we know where to access the GraphQL Playground
console.log(`🚀  Server ready at ${url}`)
