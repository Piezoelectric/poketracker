import React from "react";

type Props = {
  name: string,
  dex_number: number,
  type_1: string, // may be better to define this as enum, but later.
  type_2?: string | null,
  image_url: string,
  caught: boolean,
  toggleCaught: any, // TODO: fix type
};

export const PokemonInfoCard = (props: Props) => {
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