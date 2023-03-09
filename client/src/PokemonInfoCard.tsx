import React from "react";

type Props = {
  name: string,
  dex_number: number,
  type_1: string, // may be better to define this as enum, but later.
  type_2?: string | null,
  image_url: string
};

export const PokemonInfoCard = (props: Props) => {
  const { name, dex_number, type_1, type_2, image_url } = props;
  return (
    <div>
      sample text
      {name} {dex_number} {type_1} {type_2} {image_url}
    </div >
  )
}