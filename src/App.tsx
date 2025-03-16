import "./App.css";
import { CardContainer } from "./components/CardContainer";
import { Header } from "./components/Header";
import { useState } from "react";
import { Pokemon } from "./types";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const [selectedPokemons, setSelectedPokemons] = useState<Pokemon[]>([]);

  return (
    <>
      <ThemeProvider>
        <Header
          selectedPokemons={selectedPokemons}
          setSelectedPokemons={setSelectedPokemons}
        />
        <CardContainer
          selectedPokemons={selectedPokemons}
          setSelectedPokemons={setSelectedPokemons}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
