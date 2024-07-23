import "./App.css";
import store from "./store";
import GameStageComponent from "./components/GameStageComponent";
import { Provider } from "react-redux";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setViewportHeight);
    setViewportHeight();

    return () => {
      window.removeEventListener("resize", setViewportHeight);
    };
  }, []);

  return (
    <>
      <Provider store={store}>
        <div className="bg-cover"></div>
        <div className="App">
          <GameStageComponent />
        </div>
      </Provider>
    </>
  );
}

export default App;
