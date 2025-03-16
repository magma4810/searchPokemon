import { FC, useCallback, useEffect, useState } from "react";
import { Props, CardProps, PokemonInfo, PokemonForms } from "../types";

export const CardContainer: React.FC<Props> = ({
  selectedPokemons,
  setSelectedPokemons,
}) => {
  const deletePokemons = useCallback(
    (pokemon: string) => {
      setSelectedPokemons(selectedPokemons.filter((el) => el.name !== pokemon));
    },
    [selectedPokemons],
  );
  return (
    <div className="flex justify-center flex-wrap items-center w-[100%] h-[100%]">
      {selectedPokemons.length ? (
        selectedPokemons.map((pokemon, index) => (
          <Card
            pokemon={pokemon}
            index={index}
            key={index}
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

const Card: FC<CardProps> = ({ pokemon, index, deletePokemons }) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [pokemonForms, setPokemonForms] = useState<PokemonForms | null>(null);
  const [loading, setLoading] = useState(true);
  const pokemonId = pokemon.url.split("/")[6];

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
  }, [index]);

  return (
    <div
      key={index}
      className="relative w-[20vw] h-[20vw] bg-slate-300 m-[1vw] rounded-xl flex items-center justify-evenly flex-col overflow-hidden group"
    >
      <span className=" text-cyan-700 text-3xl">{pokemon.name}</span>
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
                    Object.entries(pokemonForms.sprites).filter(
                      ([value]) => value,
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
          onClick={() => deletePokemons(pokemon.name)}
          className="text-red-500 text-6xl opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
