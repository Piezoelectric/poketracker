import React, { useEffect, useState } from "react";
import { PokemonInfoCard } from "./PokemonInfoCard";
import { PokemonData, pokemonData } from "./data/pokemon";
import { PokemonTypeDropdown } from "./PokemonTypeDropdown";

type Props = {};

export type PokemonDataProps = PokemonData & {
  caught: boolean,
  toggleCaught: (arg0: number) => void,
}

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

  // Load caught/uncaught data from storage
  const existingData = JSON.parse(window.localStorage.getItem("POKETRACKER_APP_STATE") || '[]')

  const [pokemonDataState, setPokemonDataState] = useState(
    existingData.length > 0 ?
      existingData :
      pokemonData.map(pkmn => ({
        caught: false,
        ...pkmn
      })
      ))

  // Persist caught/uncaught to storage
  useEffect(() => {
    window.localStorage.setItem("POKETRACKER_APP_STATE", JSON.stringify(pokemonDataState))
  }, [pokemonDataState])

  const togglePokemonCaughtState = (dex_number: number) => {
    const pkmnIndex = pokemonDataState.findIndex(
      (pkmn: any) => pkmn.dex_number == dex_number)
    const pkmnCaught = pokemonDataState[pkmnIndex].caught
    const pokemonDataNewState = pokemonDataState
    pokemonDataNewState[pkmnIndex].caught = !pkmnCaught
    setPokemonDataState([...pokemonDataNewState])
  }

  const [filterByTextInput, setFilterByTextInput] = useState('')
  const [filterByType1, setFilterByType1] = useState({
    type: '',
    displayName: 'Any'
  })
  const [filterByType2, setFilterByType2] = useState({
    type: '',
    displayName: 'Any'
  })

  const filteredPokemonData = pokemonDataState.filter((pkmn: PokemonDataProps) =>
    doesPokemonFitFilters(pkmn, filterByTextInput, filterByType1.type, filterByType2.type))

  const numCaught = filteredPokemonData.filter((pkmn: PokemonDataProps) => pkmn.caught).length
  const numTotal = filteredPokemonData.length
  const percentCaught = Math.round(numCaught / numTotal * 100)

  return (
    <div>
      <div className="mb-4">
        <div className="w-7/12 inline-block pr-6">
          <label
            className="text-gray-700 text-sm font-bold mb-2"
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
        </div>

        <PokemonTypeDropdown {...{
          idName: 'type1',
          labelName: "Type 1",
          selectedType: filterByType1,
          setSelectedType: setFilterByType1
        }} />
        <PokemonTypeDropdown {...{
          idName: 'type2',
          labelName: "Type 2",
          selectedType: filterByType2,
          setSelectedType: setFilterByType2
        }} />
      </div>

      <p>You have caught <strong>{numCaught}</strong> out of <strong>{numTotal}</strong>, or <strong>~{percentCaught || 0}%</strong></p>

      <div className="container">
        <div className="grid grid-cols-3">
          {filteredPokemonData.map((pkmnData: PokemonDataProps) =>
            <PokemonInfoCard key={pkmnData.dex_number}
              {...pkmnData}
              toggleCaught={togglePokemonCaughtState}
            />
          )}
        </div>
      </div>
    </div>
  );
};
