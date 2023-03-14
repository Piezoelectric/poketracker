import React, { useEffect, useState } from "react";
import { PokemonInfoCard } from "./PokemonInfoCard";
// import { PokemonData, pokemonData } from "./data/pokemon";
import { PokemonData } from "./data/pokemon";
import { PokemonTypeDropdown } from "./PokemonTypeDropdown";
import { pokemonTypesForDisplay } from "./data/pokemonTypes";

type Props = {};

type CatchData = Record<number, boolean>
// dex_number, true/false for caught

const doesPokemonFitFilters = (
  pkmn: PokemonData,
  filterByTextInput: string,
  filterByType1: string,
  filterByType2: string) => {

  const nameIncludes = pkmn.name.includes(filterByTextInput)
  const dexNumIncludes = pkmn.dex_number.toString().includes(filterByTextInput)
  const type1Match =
    filterByType1.length > 0 ? pkmn.type_1 === filterByType1 : true
  const type2Match =
    filterByType2.length > 0 ? pkmn.type_2 === filterByType2 : true

  return (nameIncludes || dexNumIncludes) && type1Match && type2Match
}

export const PokemonListContainer = (props: Props) => {

  const [pokemonCaughtState, setPokemonCaughtState] = useState<CatchData>({})

  const togglePokemonCaughtState = (dex_number: number) => {
    const pkmnCaught = pokemonCaughtState[dex_number]
    const pokemonDataNewState = pokemonCaughtState
    pokemonDataNewState[dex_number] = !pkmnCaught
    setPokemonCaughtState({ ...pokemonDataNewState })
  }

  // Load caught/uncaught data from storage, if it exists
  const existingData = JSON.parse(window.localStorage.getItem("POKETRACKER_APP_STATE") || '[]')

  // Load pokemon data (name, number, etc... excluding catch data)
  const [pkmnData, setPkmnData] = useState<PokemonData[]>([])
  const [loadedPkmnFromApi, setLoadedPkmnFromApi] = useState(false)
  const [apiError, setApiError] = useState('')

  // Load pokemonData from API
  useEffect(() => {
    fetch("http://localhost:3001/pokemon") // TODO: move URL to .env file or something
      .then(response =>
        response.json()
      )
      .then((result) => {
        // console.debug('result', result)
        setLoadedPkmnFromApi(true)
        setPkmnData(result.sort((a:PokemonData, b:PokemonData) => a.dex_number > b.dex_number))
        // Data from API isn't guaranteed to be in dex order, e.g. ghouldengo

        // If existingData is empty (i.e. no previous data),
        // create a new pokemonCaughtState from scratch
        if (existingData.length === 0) {
          const blankCatchData: CatchData = {}
          result.forEach((pkmn: PokemonData) => {
            blankCatchData[pkmn.dex_number] = false
          })
          setPokemonCaughtState(blankCatchData)
        } else {
          // If new pokemon have been added or deleted,
          // modify existing data accordingly
          // (We assume that each pokemon's national dex number will stay fixed)
          const mergedCatchData: CatchData = {}
          result.forEach((pkmn: PokemonData) => { // Take only pokemon that exist
            if (existingData[pkmn.dex_number]) {
              mergedCatchData[pkmn.dex_number] = existingData[pkmn.dex_number]
            } else {
              // A new pokemon was added to the list -- assume we have not caught it
              mergedCatchData[pkmn.dex_number] = false
            }
          })
          setPokemonCaughtState(mergedCatchData)
        }
      },
        (error) => {
          setLoadedPkmnFromApi(true)
          setApiError(error.message)
        })
  }, [])

  // Persist caught/uncaught to storage
  useEffect(() => {
    window.localStorage.setItem("POKETRACKER_APP_STATE", JSON.stringify(pokemonCaughtState))
  }, [pokemonCaughtState])

  const [filterByTextInput, setFilterByTextInput] = useState('')
  const [filterByType1, setFilterByType1] = useState(pokemonTypesForDisplay[0])
  // Defaults to typeless, displayed as "Any"
  const [filterByType2, setFilterByType2] = useState(pokemonTypesForDisplay[0])

  const filteredPokemonData = pkmnData.filter((pkmn: PokemonData) =>
    doesPokemonFitFilters(pkmn, filterByTextInput, filterByType1.type, filterByType2.type))

  const numCaught = filteredPokemonData.filter((pkmn: PokemonData) => pokemonCaughtState[pkmn.dex_number]).length
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

      {loadedPkmnFromApi ?
        apiError ?
          <div>{apiError}</div>
          :
          <div>
            <p>You have caught <strong>{numCaught}</strong> out of <strong>{numTotal}</strong>, or <strong>~{percentCaught || 0}%</strong></p>

            <div className="container">
              <div className="grid grid-cols-3">
                {filteredPokemonData.map((pkmn: PokemonData) =>
                  <PokemonInfoCard key={pkmn.dex_number}
                    {...pkmn}
                    toggleCaught={togglePokemonCaughtState}
                    caught={pokemonCaughtState[pkmn.dex_number]}
                  />
                )}
              </div>
            </div>
          </div>
        :
        <div>Loading data...</div>}
    </div>
  );
};
