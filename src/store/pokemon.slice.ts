import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Pokemon } from "../types";

type PokemonState = {
  pokemons: Pokemon[];
  selectedPokemons: Pokemon[];
  pageNumber: number;
  value: string;
};

const initialState: PokemonState = {
  pokemons: [],
  selectedPokemons: [],
  pageNumber: 0,
  value: "",
};

export const pokemonSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    changePokemons: (state, action: PayloadAction<Pokemon[]>) => {
      state.pokemons = action.payload;
    },
    addSelectedPokemons: (state, action: PayloadAction<Pokemon[]>) => {
      state.selectedPokemons = action.payload;
    },
    changePageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    changeValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const pokemonReducer = pokemonSlice.reducer;
export const {
  changePokemons,
  addSelectedPokemons,
  changePageNumber,
  changeValue,
} = pokemonSlice.actions;
