import "./App.css";
import { CardContainer } from "./components/CardContainer";
import { Header } from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider>
          <Header />
          <CardContainer />
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
