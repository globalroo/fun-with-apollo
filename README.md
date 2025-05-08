## Apollo Server Pokémon Example

This project sets up a GraphQL server using Apollo Server that fetches data from the public PokeAPI.

**It includes:**

- A GraphQL schema for Pokémon data
- Resolvers that fetch Pokémon details and deep-dive into forms


## 🗂 Code Walkthrough

### Schema

#### The schema defines:
- Pokemon type, including:
  - abilities
  - forms
- Form type, with a nested detail field that fetches additional data as a type 'FormDetail'

#### Example:

```graphql
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
```
---
### Deep Dive: Resolvers

Resolvers tell GraphQL how to fetch data for each field.

#### 1️⃣ Query.fetchPokemon

```javascript
async fetchPokemon(_, { pokemonName }) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    return response.json()
}
```

#### Parameter	What is it?
- _ (parent)	The parent object. Here it’s undefined because Query is the root type.
- { pokemonName }	The arguments passed in the query, e.g., { pokemonName: "pikachu" }.

**What happens:**
The client requests data for a specific Pokémon.
- The resolver fetches Pokémon data from PokeAPI using the pokemonName.
- It returns a JSON object that matches the Pokemon type in the schema.

---

#### 2️⃣ Form.detail

```javascript
async detail(form) {
    const detailForm = await fetch(form.url)
    return detailForm.json()
}
```
#### Parameter	What is it?
- **form**	- The parent object, which is the Form object returned earlier in the query.

What happens:
- 	After fetching Pokémon data, Apollo walks through the requested fields.
-	If a query asks for detail inside a Form, Apollo:
-	Passes the entire Form object to this resolver.
-	This resolver fetches additional data using the url from the parent Form.


---
### How Resolvers Work Together

#### Example query

```js
query {
    fetchPokemon(pokemonName: "pikachu") {
        forms {
            name
            detail {
                id
                name
            }
        }
    }
}
```

####  Resolver chain:
1.	fetchPokemon runs and returns Pokémon data.
2.	Apollo walks the forms array.
3.	For each Form, Apollo sees detail is requested:
•	It runs the Form.detail resolver for each form object.

---

### 🔑 Resolver Parameter description

| **Resolver**          | **Parent (1st param)**                         | **Args (2nd param)**                | **Usage**                                                                  |
|-----------------------|------------------------------------------------|-------------------------------------|----------------------------------------------------------------------------|
| `Query.fetchPokemon`  | `undefined` (Query is the root type)           | `{ pokemonName }`                   | Fetches Pokémon data from the API based on name.                           |
| `Form.detail`         | A `Form` object (e.g., `{ name, url }`)        | `undefined` (no args in schema)     | Fetches detailed form data using the `url` field of the parent `Form`.     |
---

#### Logical flow:

- GraphQL walks the query tree.
- For each field, it asks: “How do I fetch this?”
- Each resolver focuses on one specific field and gets:
    - The parent object (to know where it’s working)
    - The arguments (if any)
- This allows nested fetching—you only fetch what’s needed.

---
#### One last thing!

Even if the original API response doesn’t include certain fields (like detail), GraphQL can “extend” your data by defining resolvers that fill in missing pieces.

**This is especially handy when:**
- Combining multiple APIs
- Adding virtual/computed fields

---

### Running the Server

#### 1️⃣ Install dependencies:

`npm install`

#### 2️⃣ Start the server:

`node index.mjs`

**You should see:**

`🚀  Server ready at http://localhost:4000/`

Test your queries in the Apollo GraphQL Playground at the logged URL.
