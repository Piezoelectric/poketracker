export type PokemonTypeDisplay = {
  type: string, // lowercase 
  displayName: string, // first letter capitalized
}

export const pokemonTypesForDisplay = [{
  type: '',
  displayName: 'Any', // for filtering by type
}, {
  type: "bug",
  displayName: "Bug",
}, {
  type: "dark",
  displayName: "Dark",
}, {
  type: "dragon",
  displayName: "Dragon",
}, {
  type: "electric",
  displayName: "Electric",
}, {
  type: "fairy",
  displayName: "Fairy"
}, {
  type: "fighting",
  displayName: "Fighting",
}, {
  type: "fire",
  displayName: "Fire",
}, {
  type: "flying",
  displayName: "Flying",
}, {
  type: "ghost",
  displayName: "Ghost",
}, {
  type: "grass",
  displayName: "Grass",
}, {
  type: "ground",
  displayName: "Ground",
}, {
  type: "ice",
  displayName: "Ice",
}, {
  type: "normal",
  displayName: "Normal",
}, {
  type: "poison",
  displayName: "Poison",
}, {
  type: "psychic",
  displayName: "Psychic",
}, {
  type: "rock",
  displayName: "Rock",
}, {
  type: "steel",
  displayName: "Steel",
}, {
  type: "water",
  displayName: "Water",
},
  // not including the ??? type
]