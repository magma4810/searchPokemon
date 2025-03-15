import { FC, useEffect, useState } from "react";

type Pokemon = {
  name: string;
  url: string;
};

type CardProps = {
  pokemon: Pokemon;
  index: number;
};

export const CardContainer: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon");
        const data = await response.json();
        setPokemons(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <div className=" flex justify-center flex-wrap items-center w-[100%] h-[100%]">
      {loading ? (
        <span className=" flex items-center justify-center h-[60vh] text-sky-500 opacity-20 text-8xl">
          Loading...
        </span>
      ) : (
        pokemons.map((pokemon, index) => (
          <Card pokemon={pokemon} index={index} key={index} />
        ))
      )}
    </div>
  );
};

type PokemonInfo = {
  sprites: {
    front_default: string;
  };
};

type PokemonForms = {
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

const Card: FC<CardProps> = ({ pokemon, index }) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [pokemonForms, setPokemonForms] = useState<PokemonForms | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      try {
        const dataInfo = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${index + 1}/`,
        ).then((response) => response.json());
        const dataForms = await fetch(
          `https://pokeapi.co/api/v2/pokemon-form/${index + 1}/`,
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
