import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { pokemonReducer } from "./pokemon.slice";

const rootReducer = combineReducers({
  pokemon: pokemonReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type StoreApp = ReturnType<typeof rootReducer>;
