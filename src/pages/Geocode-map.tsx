import { Map, Panorama, Placemark, useYMaps } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import { IGeocodeResult } from "yandex-maps";
import { v4 as uuidv4 } from "uuid";
import Pagination from "../components/Pagination/Pagination";
import { usePagination } from "../hooks/usePagination";
import DataTable, {ColumnConfig} from "../components/DataTable/DataTable";


type CoordinatesType = Array<number>;

interface IMapClickEvent {
  get: (key: string) => CoordinatesType;
}

interface IAddress {
  location: string;
  route: string;
}

interface ISavedObject {
  id: string;
  address: IAddress | null;
  coordinates: CoordinatesType | null;
}

const CENTER = [55.7522, 37.6156];
const ZOOM = 12;

const GeocodeMap = () => {
  const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [hasPanorama, setHasPanorama] = useState<boolean>(false);
  const [objectArray, setObjectArray] = useState<ISavedObject[]>([]);

  const ymaps = useYMaps(["geocode"]);
  const formattedCoordinates = coordinates ? `${coordinates[0]?.toFixed(6)}, ${coordinates[1]?.toFixed(6)}` : null;

  const handleClickMap = (e: IMapClickEvent) => {
    const coords = e.get("coords");

    if (coords) {
      setCoordinates(coords);
    }

    ymaps?.panorama
      .locate(coords)
      .then((panorama) => {
        setHasPanorama(!!panorama.length);
      })
      .catch((error) => {
        console.log("Ошибка при поиске панорамы", error);
        setHasPanorama(false);
      });

    ymaps
      ?.geocode(coords)
      .then((result) => {
        const foundAddress = handleGeoResult(result);

        if (foundAddress) setAddress(foundAddress);
      })
      .catch((error: unknown) => {
        console.log("Ошибка геокодирования", error);
        setAddress(null);
      });
  };

  function handleGeoResult(result: IGeocodeResult) {
    const firstGeoObject = result.geoObjects.get(0);

    if (firstGeoObject) {
      const properties = firstGeoObject.properties;

      const location = String(properties.get("description", {}));
      const route = String(properties.get("name", {}));

      const foundAddress = {
        location,
        route
      };

      return foundAddress;
    }
  }

  const handleSaveObject = () => {
    const localStorageObjects = localStorage.getItem("objects");

    const objectArray = localStorageObjects ? JSON.parse(localStorageObjects) : [];

    const newObject = {
      id: uuidv4(),
      address,
      coordinates
    };

    objectArray.push(newObject);

    localStorage.setItem("objects", JSON.stringify(objectArray));

    setObjectArray(objectArray);
  };

  const loadSavedObjects = () => {
    const localStorageObjects = localStorage.getItem("objects");

    if (localStorageObjects) {
      const parsedObjects = JSON.parse(localStorageObjects).map((item: ISavedObject) => ({
        ...item,
        key: item.id
      }));

      setObjectArray(parsedObjects);
    } else {
      setObjectArray([]);
    }
  };

  const handleClearLocalStorage = () => {
    localStorage.clear();
    setObjectArray([]);
  };

  useEffect(() => {
    loadSavedObjects();
  }, []);

  const { currentPage, totalPages, paginatedData, handlePageChange } = usePagination<ISavedObject>({
    initialPage: 1,
    pageSize: 10,
    totalItems: objectArray.length
  });
  const paginatedObjects = paginatedData(objectArray);

  const columns: ColumnConfig<ISavedObject>[] = [
    {
      header: "Локация",
      render: (item) => item.address?.location || "-"
    },
    {
      header: "Адрес",
      render: (item) => item.address?.route || "-"
    },
    {
      header: "Координаты",
      render: (item) => (item.coordinates ? `${item.coordinates[0]}, ${item.coordinates[1]}` : "-")
    }
  ];

  return (
    <main>

      <section className="map-container">
        <article className="location-info">
          {address ? (
            <>
              <p>{`Локация: ${address?.location}`}</p>
              <p>{`Адрес: ${address?.route}`}</p>
              <p>{`Координаты: ${formattedCoordinates}`}</p>

              {hasPanorama && coordinates ? (
                <Panorama key={coordinates?.join(",")} defaultPoint={coordinates ?? undefined} className="panorama" />
              ) : (
                <div className="no-panorama">
                  <p>Панорама не найдена</p>
                </div>
              )}
              <button className="primary-button" onClick={handleSaveObject}>
                Сохранить
              </button>
            </>
          ) : (
            <p className="empty-message">Выберите точку на карте</p>
          )}
        </article>

        <Map
          defaultState={{ center: CENTER, zoom: ZOOM }}
          onClick={(e: IMapClickEvent) => handleClickMap(e)}
          className="map"
        >
          {coordinates && <Placemark geometry={coordinates} />}
        </Map>
      </section>

      {objectArray.length > 0 && (
        <section className="locations-container">
          <div className="table-title">
            <h3>Сохраненные локации</h3>
            <button className="clear-button" onClick={handleClearLocalStorage}>
              Очистить
            </button>
          </div>

          <DataTable data={paginatedObjects} columns={columns} />

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
      )}
    </main>
  );
};

export default GeocodeMap;
