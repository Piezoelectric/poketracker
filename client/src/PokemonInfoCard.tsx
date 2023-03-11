import React from "react";
import PokeBallIcon from "./PokeBallIcon";
import { PokemonDataProps } from "./PokemonListContainer";

import "./styles/pokemon-types.module.css"

export const PokemonInfoCard = (props: PokemonDataProps) => {
  const { name, dex_number, type_1, type_2, image_url, caught, toggleCaught } = props;
  const cardStyle = `rounded-lg shadow-lg ${caught ? 'bg-[#22c55e]' : 'bg-white' } m-3 grid grid-cols-4`
  const type1Icon = `type-icon ${type_1}`
  return (
    <div className={cardStyle}>
      <div className="m-auto">
        <button onClick={() => toggleCaught(dex_number)}>
          {caught ? PokeBallIcon("red") : PokeBallIcon("gray")}
        </button>
      </div>
      <div className="col-span-3 text-center">
        <div><strong>{name[0].toUpperCase() + name.slice(1)}</strong></div>
        <div><strong>#{dex_number}</strong></div>
        <div className='w-full'><img className='mx-auto' alt={name} src={image_url}/></div>
        <div>
          <div className='type-icon bug'></div>
        </div>
      </div>
    </div>
  )
}