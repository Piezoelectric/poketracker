import React, { useState } from "react";
import { PokemonInfoCard } from "./PokemonInfoCard";
import { pokemonData } from "./data/pokemon";
import { PokemonTypeDropdown } from "./PokemonTypeDropdown";

type Props = {};

const doesPokemonFitFilters = (
  pkmn: any,
  filterByTextInput: string,
  filterByType1: string,
  filterByType2: string) => {

  const nameIncludes = pkmn.name.includes(filterByTextInput)
  const dexNumIncludes = pkmn.dex_number.toString().includes(filterByTextInput)
  const type1Match =
    filterByType1.length > 0 ? pkmn.type_1 == filterByType1 : true
  const type2Match =
    filterByType2.length > 0 ? pkmn.type_2 == filterByType2 : true

  return (nameIncludes || dexNumIncludes) && type1Match && type2Match
}

export const PokemonListContainer = (props: Props) => {

  // Caught/uncaught should be managed in this component,
  // same for search and filtering

  const [pokemonDataState, setPokemonDataState] = useState(
    pokemonData.map(pkmn => ({
      caught: false,
      ...pkmn
    })
    ))

  const [filterByTextInput, setFilterByTextInput] = useState('')
  const [filterByType1, setFilterByType1] = useState({
    type: '',
    displayName: 'Any'
  })
  const [filterByType2, setFilterByType2] = useState({
    type: '',
    displayName: 'Any'
  })

  const filteredPokemonData = pokemonDataState.filter(pkmn =>
    doesPokemonFitFilters(pkmn, filterByTextInput, filterByType1.type, filterByType2.type))

  const numCaught = 10; // placeholder
  const numTotal = filteredPokemonData.length
  const percentCaught = Math.round(numCaught/numTotal*100)

  return (
    <div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="pokemon-list-filter"
        >
          Filter By Name or PokeDex Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="pokemon-list-filter"
          type="text"
          placeholder="Enter name or PokeDex Number..."
          onChange={event => setFilterByTextInput(event.target.value)}
        />

        <PokemonTypeDropdown {...{
          className: 'type1',
          labelName: "Type 1",
          selectedType: filterByType1,
          setSelectedType: setFilterByType1
        }} />
        <PokemonTypeDropdown {...{
          className: 'type2',
          labelName: "Type 2",
          selectedType: filterByType2,
          setSelectedType: setFilterByType2
        }} />
      </div>

      <p>You have caught <strong>{numCaught}</strong> out of <strong>{numTotal}</strong>, or <strong>~{percentCaught}%</strong></p>

      {filteredPokemonData.map(pkmnData =>
        <PokemonInfoCard key={pkmnData.dex_number}{...pkmnData}
        />
      )}

    </div>
  );
};
