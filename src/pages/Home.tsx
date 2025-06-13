import { Map, Panorama, Placemark, useYMaps } from "@pbe/react-yandex-maps";
import { useEffect, useState, useCallback } from "react";
import { IGeocodeResult } from "yandex-maps";
import Pagination from "../components/Pagination/Pagination";
import { usePagination } from "../hooks/usePagination";
import DataTable, { ColumnConfig } from "../components/DataTable/DataTable";
import Button from "../components/Button/Button";
import AccidentForm from "../widgets/Form/AccidentForm";
import { AccidentData, useAccidentStore } from "../store/accidentStore";
import "./home.css";

type CoordinatesType = Array<number>;

interface IMapClickEvent {
  get: (key: string) => CoordinatesType;
}

interface IAddress {
  location: string;
  route: string;
}

const CENTER = [55.7522, 37.6156];
const ZOOM = 12;

const Main = () => {
  const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [hasPanorama, setHasPanorama] = useState<boolean>(false);
  const { history, loadFromHistory, clearHistory, currentForm, updatePartialForm } = useAccidentStore();

  const ymaps = useYMaps(["geocode"]);
  const formattedCoordinates = coordinates ? `${coordinates[0]?.toFixed(6)}, ${coordinates[1]?.toFixed(6)}` : null;

  const loadMapInfo = useCallback(
    async (coords: CoordinatesType) => {
      if (!ymaps) return;

      setCoordinates(coords);

      try {
        const panorama = await ymaps.panorama.locate(coords);
        setHasPanorama(!!panorama.length);
      } catch (error) {
        console.log("Ошибка при поиске панорамы", error);
        setHasPanorama(false);
      }

      try {
        const result = await ymaps.geocode(coords);
        const foundAddress = handleGeoResult(result);
        if (foundAddress) setAddress(foundAddress);
      } catch (error) {
        console.log("Ошибка геокодирования", error);
        setAddress(null);
      }
    },
    [ymaps]
  );

  useEffect(() => {
    if (currentForm.point_lat && currentForm.point_long) {
      const coords: CoordinatesType = [+currentForm.point_lat, +currentForm.point_long];
      loadMapInfo(coords);
    }
  }, [currentForm.point_lat, currentForm.point_long, loadMapInfo]);

  const handleClickMap = (e: IMapClickEvent) => {
    const coords = e.get("coords");
    if (!coords) return;

    updatePartialForm({
      point_lat: +coords[0].toFixed(6),
      point_long: +coords[1].toFixed(6)
    });

    loadMapInfo(coords);
  };

  function handleGeoResult(result: IGeocodeResult) {
    const firstGeoObject = result.geoObjects.get(0);

    if (firstGeoObject) {
      const properties = firstGeoObject.properties;

      const location = String(properties.get("description", {}));
      const route = String(properties.get("name", {}));

      const foundAddress = { location, route};

      return foundAddress;
    }
  }

  const { currentPage, totalPages, paginatedData, handlePageChange } = usePagination<AccidentData>({
    initialPage: 1,
    pageSize: 10,
    totalItems: history.length
  });
  const paginatedObjects = paginatedData(history);

  const columns: ColumnConfig<AccidentData>[] = [
    {
      header: "Координаты",
      render: (item) => (item.form.point_lat && item.form.point_long ? `${item.form.point_lat}, ${item.form.point_long}` : "-")
    }
  ];

  return (
    <main className="home-main-section">
      <section>
        <h2>Форма ДТП</h2>
        <AccidentForm />
      </section>

      <section>
        <h2>Карта</h2>
        <div className="map-container">
          <article className="location-info">
            {address ? (
              <>
                <div>
                  <p>{`Локация: ${address?.location}`}</p>
                  <p>{`Адрес: ${address?.route}`}</p>
                  <p>{`Координаты: ${formattedCoordinates}`}</p>
                </div>

                {hasPanorama && coordinates ? (
                  <Panorama key={coordinates?.join(",")} defaultPoint={coordinates ?? undefined} className="panorama" />
                ) : (
                  <div className="no-panorama">
                    <p>Панорама не найдена</p>
                  </div>
                )}
              </>
            ) : (
              <p className="empty-message">Выберите точку на карте</p>
            )}
          </article>

          <Map defaultState={{ center: CENTER, zoom: ZOOM }} onClick={(e: IMapClickEvent) => handleClickMap(e)} className="map">
            {coordinates && <Placemark geometry={coordinates} />}
          </Map>
        </div>
      </section>

      {history.length > 0 && (
        <section>
          <div className="table-title">
            <h3>Сохраненные локации</h3>
            <Button onClick={clearHistory} variant="danger">
              Очистить
            </Button>
          </div>

          <DataTable
            getRowKey={(item) => item.id}
            onRowClick={(item) => loadFromHistory(item.id)}
            data={paginatedObjects}
            columns={columns}
          />

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
      )}
    </main>
  );
};

export default Main;
