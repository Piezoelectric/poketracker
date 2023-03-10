import React, { Dispatch, SetStateAction, useState } from "react";
import { pokemonTypesForDisplay, PokemonDisplayType } from "./data/pokemonTypes";

type Props = {
  className: "type1" | "type2",
  labelName: "Type 1" | "Type 2",
  selectedType: PokemonDisplayType,
  setSelectedType: Dispatch<SetStateAction<PokemonDisplayType>>,
};

export const PokemonTypeDropdown = (props: Props) => {
  const { className, labelName, selectedType, setSelectedType } = props

  const [open, setOpen] = useState(false)
  const toggleOpenClose = () => {
    setOpen(!open)
  }

  return (
    <div className={className}>
      <button onClick={toggleOpenClose}>{labelName}</button>
      {open ? (
        <ul className="menu">
          {pokemonTypesForDisplay.map(displayType => 
            <li className="menu-item" key={displayType.displayName}>
              <button onClick={() => {
                setSelectedType(displayType)
                toggleOpenClose()
              }}>{displayType.displayName}</button>
            </li>)}
        </ul>
      ) : selectedType.displayName}
    </div>
  )
}