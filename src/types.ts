export type Pokemon = {
  name: string;
  url: string;
};

export type CardProps = {
  pokemon: Pokemon;
  index: number;
  selectedPokemons: Pokemon[];
  setSelectedPokemons: (pokemons: Pokemon[]) => void;
};

export type CardPropsHesder = {
  pokemon: Pokemon;
  index: number;
  selectedPokemons: Pokemon[];
  setSelectedPokemons: (pokemons: Pokemon[]) => void;
};

export type Props = {
  selectedPokemons: Pokemon[];
  setSelectedPokemons: (pokemons: Pokemon[]) => void;
};

export type PokemonInfo = {
  sprites: {
    front_default: string;
  };
};

export type InputListProps = {
  pokemons: Pokemon[];
  setPokemons: (pokemons: Pokemon[]) => void;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  value: string;
  setSelectedPokemons: (pokemons: Pokemon[]) => void;
  selectedPokemons: Pokemon[];
};

export type PokemonForms = {
  sprites: {
    back_default: string;
    back_female: string | null;
    back_shiny: string;
    back_shiny_female: string | null;
    front_default: string;
    front_female: string | null;
    front_shiny: string;
    front_shiny_female: string | null;
  };
};
