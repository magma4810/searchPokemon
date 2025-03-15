import "./App.css";
import { CardContainer } from "./components/CardContainer";
import { Header } from "./components/Header";
import { useState } from "react";
import { Pokemon } from "./types";

function App() {
  const [selectedPokemons, setSelectedPokemons] = useState<Pokemon[]>([]);

  return (
    <>
      <Header
        selectedPokemons={selectedPokemons}
        setSelectedPokemons={setSelectedPokemons}
      />
      <CardContainer
        selectedPokemons={selectedPokemons}
        setSelectedPokemons={setSelectedPokemons}
      />
    </>
  );
}

export default App;
