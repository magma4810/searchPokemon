import { FC, useEffect, useState, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pokemon,
  CardPropsHesder,
  PokemonInfo,
  Props,
  InputListProps,
} from "../types";

export const Header: React.FC<Props> = ({
  selectedPokemons,
  setSelectedPokemons,
}) => {
  const [value, setValue] = useState("");
  const [click, setClick] = useState(false);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setClick(false);
        setValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-center items-center w-full h-[20vh] bg-red-900">
      <div
        className="w-[60%] h-[50%] flex items-center justify-center relative"
        ref={inputRef}
      >
        <input
          value={value}
          onClick={() => setClick(true)}
          onChange={(ev) => setValue(ev.target.value)}
          placeholder="Начните вводить имя покемона"
          type="text"
          className="pl-[1vw] w-[100%] h-[50%]"
        />
        <AnimatePresence>
          {click && (
            <InputList
              pokemons={pokemons}
              setPokemons={setPokemons}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              value={value}
              setSelectedPokemons={setSelectedPokemons}
              selectedPokemons={selectedPokemons}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const InputList: React.FC<InputListProps> = memo(
  ({
    pokemons,
    setPokemons,
    pageNumber,
    setPageNumber,
    value,
    setSelectedPokemons,
    selectedPokemons,
  }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchPokemons = async () => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?offset=${pageNumber}&limit=20`,
          );
          const data = await response.json();
          if (pageNumber === 0) {
            setPokemons(data.results);
          } else {
            setPokemons([...pokemons, ...data.results]);
          }
          setLoading(false);
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
        }
      };

      fetchPokemons();
    }, [pageNumber]);

    const filteredPokemons = useMemo(() => {
      return pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(value.toLowerCase()),
      );
    }, [value, pokemons]);

    return (
      <motion.div
        className="w-[100%] h-[80vh] bg-slate-50/90 absolute top-full left-0 overflow-y-auto z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: -20 }}
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
              filteredPokemons.map((pokemon, index) => (
                <CardInput
                  pokemon={pokemon}
                  index={index}
                  setSelectedPokemons={setSelectedPokemons}
                  selectedPokemons={selectedPokemons}
                  key={pokemon.name}
                />
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
                setPageNumber(pageNumber + 20);
              }}
            >
              Show more
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  },
);

const CardInput: FC<CardPropsHesder> = ({
  pokemon,
  index,
  setSelectedPokemons,
  selectedPokemons,
}) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const pokemonId = pokemon.url.split("/")[6];

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
      setSelectedPokemons([...selectedPokemons, pokemon]);
    }
  };

  return (
    <button
      key={index}
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
