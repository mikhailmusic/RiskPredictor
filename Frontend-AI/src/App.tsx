import { YMaps } from "@pbe/react-yandex-maps";
import Home from "./pages/Home";

function App() {
  return (
    <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_API_KEY, load: "package.full" }}>
      <Home />
    </YMaps>
  );
}

export default App;
