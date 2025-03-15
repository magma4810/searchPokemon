import { FC, useEffect, useState } from "react";
import { Props, CardProps, PokemonInfo, PokemonForms } from "../types";

export const CardContainer: React.FC<Props> = ({
  selectedPokemons,
  setSelectedPokemons,
}) => {
  setSelectedPokemons(selectedPokemons); //
  return (
    <div className=" flex justify-center flex-wrap items-center w-[100%] h-[100%]">
      {selectedPokemons.map((pokemon, index) => (
        <Card pokemon={pokemon} index={index} key={index} />
      ))}
    </div>
  );
};

const Card: FC<CardProps> = ({ pokemon, index }) => {
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
      className=" w-[20vw] h-[20vw] bg-slate-300 m-[1vw] rounded-xl flex items-center justify-evenly flex-col"
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
                {/* [_,value] */}
              </>
            ) : (
              <span>No data</span>
            )}
          </div>
        </>
      ) : (
        <span>No data</span>
      )}
    </div>
  );
};
