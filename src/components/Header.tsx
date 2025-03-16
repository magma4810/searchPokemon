import { FC, useEffect, useState, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pokemon, CardPropsHesder, PokemonInfo } from "../types";
import { useTheme } from "./hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { StoreApp } from "../store";
import {
  changePokemons,
  addSelectedPokemons,
  changePageNumber,
  changeValue,
} from "../store/pokemon.slice";

export const Header: React.FC = () => {
  const [click, setClick] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLight, toggleTheme } = useTheme();
  const value = useSelector((store: StoreApp) => store.pokemon.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setClick(false);
        dispatch(changeValue(""));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`flex justify-center items-center w-full h-[15vh] bg-red-900 ${isLight ? "bg-red-900" : "bg-gray-900"}`}
    >
      <div
        className="w-[60%] h-[50%] flex items-center justify-center relative"
        ref={inputRef}
      >
        <input
          value={value}
          onClick={() => setClick(true)}
          onChange={(ev) => dispatch(changeValue(ev.target.value))}
          placeholder="Начните вводить имя покемона"
          type="text"
          className="pl-[1vw] w-[100%] h-[70%]"
        />
        <AnimatePresence>{click && <InputList />}</AnimatePresence>
      </div>
      <button
        onClick={toggleTheme}
        className="ml-4 p-2 bg-blue-500 text-white rounded"
      >
        {isLight ? "Темная тема" : "Светлая тема"}
      </button>
    </header>
  );
};

const InputList: React.FC = memo(() => {
  const [loading, setLoading] = useState(true);
  const pokemons = useSelector((store: StoreApp) => store.pokemon.pokemons);
  const pageNumber = useSelector((store: StoreApp) => store.pokemon.pageNumber);
  const value = useSelector((store: StoreApp) => store.pokemon.value);
  const dispatch = useDispatch();
  useEffect(() => {
    const pokemonsLocalStorage: Pokemon[] = localStorage["pokemons"]
      ? JSON.parse(localStorage["pokemons"]).results
      : null;
    if (pokemonsLocalStorage && loading) {
      setLoading(false);
      dispatch(changePokemons(pokemonsLocalStorage));
    } else {
      const fetchPokemons = async () => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?offset=${pageNumber}&limit=20`,
          );
          const data = await response.json();
          if (pageNumber === 0) {
            dispatch(changePokemons(pokemonsLocalStorage));
          } else {
            const updatedPokemons = [...pokemons, ...data.results];
            dispatch(changePokemons(updatedPokemons));
          }
          if (loading) {
            localStorage.setItem("pokemons", JSON.stringify(data));
          }
          setLoading(false);
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
        }
      };
      fetchPokemons();
    }
  }, [pageNumber]);
  const memoizedPokemons = useMemo(() => pokemons, [pokemons]);
  const filteredPokemons = useMemo(() => {
    return memoizedPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(value.toLowerCase()),
    );
  }, [value, memoizedPokemons]);

  return (
    <motion.div
      className="w-[100%] h-[80vh] bg-slate-50/90 absolute top-full left-0 overflow-y-auto z-10"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: -10 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.5 }}
    >
      <div className=" flex flex-col justify-center items-center w-[100%] ">
        <div className="flex flex-wrap w-[100%] h-[100%] ">
          {loading ? (
            <span className="flex items-center justify-center h-[60vh] w-[100%] text-sky-500 opacity-20 text-8xl">
              Loading...
            </span>
          ) : filteredPokemons.length ? (
            filteredPokemons.map((pokemon) => (
              <CardInput pokemon={pokemon} key={pokemon.name} />
            ))
          ) : (
            <span className="flex items-center justify-center h-[70vh] w-[100vw] text-sky-500 opacity-20 text-5xl">
              Такой покемон не найден
            </span>
          )}
        </div>
        <div className="w-[7vw] pb-5">
          <motion.button
            className="text-sky-500 p-[0.5vw] border-2 border-cyan-400 rounded-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 10px 2px rgba(34, 211, 238, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => {
              dispatch(changePageNumber(pageNumber + 20));
            }}
          >
            Show more
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

const CardInput: FC<CardPropsHesder> = ({ pokemon }) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const pokemonId = pokemon.url.split("/")[6];
  const selectedPokemons = useSelector(
    (store: StoreApp) => store.pokemon.selectedPokemons,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      try {
        const dataInfo = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
        ).then((response) => response.json());
        setPokemonInfo(dataInfo);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchPokemonInfo();
  }, [pokemonId]);

  const handleAddPokemon = () => {
    const isPokemonSelected = selectedPokemons.some(
      (selectedPokemon) => selectedPokemon.name === pokemon.name,
    );

    if (!isPokemonSelected) {
      dispatch(addSelectedPokemons([...selectedPokemons, pokemon]));
    }
  };

  return (
    <button
      key={pokemon.name}
      className="w-[8vw] h-[8vw] bg-slate-300 m-[2vw] rounded-xl flex items-center justify-evenly flex-col"
      onClick={handleAddPokemon}
    >
      <span className="text-cyan-700">{pokemon.name}</span>
      {loading ? (
        <span>Loading...</span>
      ) : pokemonInfo ? (
        <img src={pokemonInfo.sprites.front_default} alt={pokemon.name} />
      ) : (
        <span>No data</span>
      )}
    </button>
  );
};
