import { YMaps } from "@pbe/react-yandex-maps";
import GeocodeMap from "./pages/Geocode-map";

function App() {
  return (
    <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_API_KEY, load: "package.full" }}>
      <GeocodeMap />
    </YMaps>
  );
}

export default App;
