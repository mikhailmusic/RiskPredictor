import React, { useState } from "react";
import Input from "../../components/Input/Input";
import Dropdown from "../../components/Dropdown/Dropdown";
import MultiDropdown from "../../components/Dropdown/MultiDropdown";
import Button from "../../components/Button/Button";
import "./accident.form.css";

interface AccidentFormData {
  point: { lat: number; long: number };
  weather: string[];
  road_conditions: string[];
  vehicle_year: number;
  vehicle_brand: string;
  vehicle_color: string;
  vehicle_model: string;
  vehicle_category: string;
  participants_count: number;
  driver_gender: string;
  driving_experience: number;
  day_of_week: number;
  time_of_day: string;
}

const genderOptions = [
  { label: "Мужской", value: "Мужской" },
  { label: "Женский", value: "Женский" }
];

const timeOfDayOptions = [
  { label: "Утро", value: "Утро" },
  { label: "День", value: "День" },
  { label: "Вечер", value: "Вечер" },
  { label: "Ночь", value: "Ночь" }
];

const weatherOptions = ["Солнечно", "Дождь", "Снег", "Пасмурно"];
const roadConditionsOptions = ["Сухое", "Мокрое", "Заснеженное", "Гололёд"];

const AccidentForm: React.FC = () => {
  const [formData, setFormData] = useState<AccidentFormData>({
    point: { lat: 0, long: 0 },
    weather: [],
    road_conditions: [],
    vehicle_year: 0,
    vehicle_brand: "",
    vehicle_color: "",
    vehicle_model: "",
    vehicle_category: "",
    participants_count: 0,
    driver_gender: "",
    driving_experience: 0,
    day_of_week: 0,
    time_of_day: ""
  });

  const handleChange = <K extends keyof AccidentFormData>(key: K, value: AccidentFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePointChange = (field: "lat" | "long", value: number) => {
    setFormData((prev) => ({
      ...prev,
      point: { ...prev.point, [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Отправка формы:", formData);
    // здесь можно добавить валидацию и отправку
  };

  return (
    <form className="accident-form" onSubmit={handleSubmit}>
      <div className="coordinates-group">
        <Input
          id="pointLat"
          label="Широта"
          type="number"
          value={formData.point.lat}
          onChange={(e) => handlePointChange("lat", +e.target.value)}
        />
        <Input
          id="pointLong"
          label="Долгота"
          type="number"
          value={formData.point.long}
          onChange={(e) => handlePointChange("long", +e.target.value)}
        />
      </div>
      <div className="fields-grid">
        <Input
          id="dayOfWeek"
          label="День недели (0-6)"
          type="number"
          min={0}
          value={formData.day_of_week}
          onChange={(e) => handleChange("day_of_week", +e.target.value)}
        />
        <Dropdown
          id="timeOfDay"
          label="Время суток"
          options={timeOfDayOptions}
          value={formData.time_of_day}
          onChange={(val) => handleChange("time_of_day", val)}
        />
        <MultiDropdown
          id="weather"
          label="Погода"
          options={weatherOptions.map((w) => ({ label: w, value: w }))}
          values={formData.weather}
          onChange={(newValues) => handleChange("weather", newValues)}
        />

        <MultiDropdown
          id="road_conditions"
          label="Состояние дороги"
          options={roadConditionsOptions.map((r) => ({ label: r, value: r }))}
          values={formData.road_conditions}
          onChange={(newValues) => handleChange("road_conditions", newValues)}
        />

        <Input
          id="vehicleBrand"
          label="Марка автомобиля"
          value={formData.vehicle_brand}
          onChange={(e) => handleChange("vehicle_brand", e.target.value)}
        />
        <Input
          id="vehicleModel"
          label="Модель"
          value={formData.vehicle_model}
          onChange={(e) => handleChange("vehicle_model", e.target.value)}
        />
        <Input
          id="vehicleColor"
          label="Цвет"
          value={formData.vehicle_color}
          onChange={(e) => handleChange("vehicle_color", e.target.value)}
        />
        <Input
          id="vehicleYear"
          label="Год выпуска"
          type="number"
          min={0}
          value={formData.vehicle_year}
          onChange={(e) => handleChange("vehicle_year", +e.target.value)}
        />

        <Input
          id="vehicleCategory"
          label="Категория ТС"
          value={formData.vehicle_category}
          onChange={(e) => handleChange("vehicle_category", e.target.value)}
        />
        <Input
          id="ParticipantsCount"
          label="Кол-во участников"
          type="number"
          min={0}
          value={formData.participants_count}
          onChange={(e) => handleChange("participants_count", +e.target.value)}
        />
        <Dropdown
          id="driverGender"
          label="Пол водителя"
          options={genderOptions}
          value={formData.driver_gender}
          onChange={(val) => handleChange("driver_gender", val)}
        />
        <Input
          id="DrivingExperience"
          label="Стаж вождения"
          type="number"
          min={0}
          value={formData.driving_experience}
          onChange={(e) => handleChange("driving_experience", +e.target.value)}
        />
      </div>
      <Button type="button">Проверить</Button>
    </form>
  );
};

export default AccidentForm;
