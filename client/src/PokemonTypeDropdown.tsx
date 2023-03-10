import React, { useState } from "react";
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { pokemonTypesForDisplay, PokemonTypeDisplay } from "./data/pokemonTypes";

type Props = {
  idName: "type1" | "type2",
  labelName: "Type 1" | "Type 2",
  selectedType: PokemonTypeDisplay,
  setSelectedType: (arg0: PokemonTypeDisplay) => void,
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const PokemonTypeDropdown = (props: Props) => {
  const { idName, labelName, selectedType, setSelectedType } = props

  const [open, setOpen] = useState(false)
  const toggleOpenClose = () => {
    setOpen(!open)
  }

  return (
    // @ts-ignore Type '{ children: Element[]; as: string; }' is not assignable to type 'CleanProps<string, never>'.
    // Appears to be an open issue with tailwind+headlessUI, despite being in the tailwindUI examples.
    // https://github.com/tailwindlabs/headlessui/discussions/1421
    <Menu as="div" className="w-2/12 relative inline-block text-left px-1">
      <div id={idName}>
        <label
          className="text-gray-700 text-sm font-bold mb-2"
          htmlFor="pokemon-list-filter"
        >
          {labelName}
        </label>
        <Menu.Button 
          onClick={toggleOpenClose}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {selectedType.displayName}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {pokemonTypesForDisplay.map(displayType => 
            <Menu.Item 
              key={displayType.displayName} 
              onClick={() => setSelectedType(displayType)}
            >
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  {displayType.displayName}
                </a>
              )}
            </Menu.Item>)}
        </div>
      </Menu.Items>
    </Menu>
  )
}