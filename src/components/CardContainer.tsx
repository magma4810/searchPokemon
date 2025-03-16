import { FC, useCallback, useEffect, useState } from "react";
import { CardProps, PokemonInfo, PokemonForms, Pokemon } from "../types";
import { useTheme } from "./hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { StoreApp } from "../store";
import { addSelectedPokemons } from "../store/pokemon.slice";

export const CardContainer: React.FC = () => {
  const selectedPokemons = useSelector(
    (store: StoreApp) => store.pokemon.selectedPokemons,
  );
  const dispatch = useDispatch();
  const deletePokemons = useCallback(
    (pokemon: Pokemon) => {
      dispatch(
        addSelectedPokemons(
          selectedPokemons.filter((el) => el.name !== pokemon.name),
        ),
      );
    },
    [selectedPokemons],
  );
  const { isLight } = useTheme();
  return (
    <div
      className={`flex overflow-y-auto justify-center flex-wrap items-center h-[85vh] w-[100%] ${isLight ? " bg-slate-100 " : " bg-slate-300"}`}
    >
      {selectedPokemons.length ? (
        selectedPokemons.map((pokemon) => (
          <CardHeader
            key={pokemon.name}
            pokemon={pokemon}
            deletePokemons={deletePokemons}
          />
        ))
      ) : (
        <div className="flex items-center justify-center w-full h-[70vh]">
          <span className="text-sky-500 opacity-20 text-5xl">
            Список покемонов пока пуст
          </span>
        </div>
      )}
    </div>
  );
};

const CardHeader: FC<CardProps> = ({ pokemon, deletePokemons }) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [pokemonForms, setPokemonForms] = useState<PokemonForms | null>(null);
  const [loading, setLoading] = useState(true);
  const pokemonId = pokemon.url.split("/")[6];
  const { isLight } = useTheme();

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      try {
        const dataInfo = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
        ).then((response) => response.json());
        const dataForms = await fetch(
          `https://pokeapi.co/api/v2/pokemon-form/${pokemonId}/`,
        ).then((response) => response.json());
        setPokemonForms(dataForms);
        setPokemonInfo(dataInfo);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchPokemonInfo();
  }, []);

  return (
    <div
      key={pokemon.name}
      className={`relative w-[20vw] h-[20vw] m-[1vw] rounded-xl flex items-center justify-evenly flex-col overflow-hidden group ${isLight ? " bg-slate-300 " : " bg-cyan-700"}`}
    >
      <span
        className={`text-3xl ${isLight ? " text-cyan-700 " : " text-slate-300"}`}
      >
        {pokemon.name}
      </span>
      {loading ? (
        <span>Loading...</span>
      ) : pokemonInfo ? (
        <>
          <img src={pokemonInfo.sprites.front_default} alt={pokemon.name} />
          <div className=" flex w-full items-center justify-evenly flex-wrap">
            {pokemonForms ? (
              <>
                <span>Forms: </span>
                {Object.entries(pokemonForms.sprites).map(
                  ([key, value]) =>
                    value && (
                      <img
                        key={key}
                        className=" w-[4vw]"
                        src={value}
                        alt={`${pokemon.name} ${key}`}
                      />
                    ),
                )}
                <span>
                  Forms count:{" "}
                  {
                    Object.values(pokemonForms.sprites).filter(
                      (value) => value !== null && value !== undefined,
                    ).length
                  }
                </span>
              </>
            ) : (
              <span>No data</span>
            )}
          </div>
        </>
      ) : (
        <span>No data</span>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 backdrop-blur-0 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-50 group-hover:backdrop-blur-sm">
        <button
          onClick={() => deletePokemons(pokemon)}
          className="text-red-500 text-6xl opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
