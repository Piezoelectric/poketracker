import React from "react";
import { PokemonDataProps } from "./PokemonListContainer";

export const PokemonInfoCard = (props: PokemonDataProps) => {
  const { name, dex_number, type_1, type_2, image_url, caught, toggleCaught } = props;
  return (
    <div>
      <div>sample text!</div>
      <div>{name} {dex_number} {type_1} {type_2} {image_url}</div>
      <button onClick={() => toggleCaught(dex_number)}>
        Mark as {caught ? 'uncaught' : 'caught'}
      </button>
    </div >
  )
}