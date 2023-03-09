import React, { useState } from "react";
import { PokemonInfoCard } from "./PokemonInfoCard";
import { pokemonData } from "./data/pokemon";

type Props = {};

export const PokemonListContainer = (props: Props) => {

  // Caught/uncaught should be managed in this component,
  // same for search and filtering

  const [pokemonDataState, setPokemonDataState] = useState(
    pokemonData.map(pkmn => ({
      caught: false,
      ...pkmn
    })
    ))

  const [filterByName, setFilterByName] = useState('')

  const filteredPokemonData = pokemonDataState.filter(pkmn => pkmn.name.includes(filterByName))

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
          onChange={event => setFilterByName(event.target.value)}
        />
      </div>

      <p>You have caught <strong>X</strong> out of <strong>X</strong>, or <strong>~X%</strong></p>

      {filteredPokemonData.map(pkmnData =>
        <PokemonInfoCard {...pkmnData}
        />
      )}

    </div>
  );
};
