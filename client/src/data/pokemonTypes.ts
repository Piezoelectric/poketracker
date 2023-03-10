export type PokemonTypeDisplay = {
  type: string, // lowercase 
  displayName: string, // first letter capitalized
  // marginLeft, marginTop for offsetting type-icons.png
  // type-icons dimensions: 200 x 200,
  // 7px margin at top and bottom,
  // 9px margin at left and right,
  // type icons are 53 long 20 tall
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