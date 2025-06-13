import { timeOfDayOptions, weatherOptions, roadConditionsOptions, genderOptions } from "../../api/types";
import { useAccidentStore } from "../../store/accidentStore";
import Input from "../../components/Input/Input";
import Dropdown from "../../components/Dropdown/Dropdown";
import MultiDropdown from "../../components/Dropdown/MultiDropdown";
import Button from "../../components/Button/Button";
import "./accident.form.css";

const AccidentForm: React.FC = () => {
  const { currentForm, addToHistory, updatePartialForm } = useAccidentStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: отправка на сервер (await axios...)

      addToHistory();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <form className="accident-form" onSubmit={handleSubmit}>
      <div className="coordinates-group">
        <Input
          id="pointLat"
          label="Широта"
          type="number"
          value={currentForm.point_lat ?? 0}
          onChange={(e) => updatePartialForm({ point_lat: +e.target.value })}
        />
        <Input
          id="pointLong"
          label="Долгота"
          type="number"
          value={currentForm.point_long ?? 0}
          onChange={(e) => updatePartialForm({ point_long: +e.target.value })}
        />
      </div>

      <div className="fields-grid">
        <Input
          id="dayOfWeek"
          label="День недели (0-6)"
          type="number"
          min={0}
          value={currentForm.day_of_week ?? 0}
          onChange={(e) => updatePartialForm({ day_of_week: +e.target.value })}
        />
        <Dropdown
          id="timeOfDay"
          label="Время суток"
          options={timeOfDayOptions}
          value={currentForm.time_of_day ?? ""}
          onChange={(val) => updatePartialForm({ time_of_day: val })}
        />
        <MultiDropdown
          id="weather"
          label="Погода"
          options={weatherOptions.map((w) => ({ label: w, value: w }))}
          values={currentForm.weather ?? []}
          onChange={(newValues) => updatePartialForm({ weather: newValues })}
        />
        <MultiDropdown
          id="road_conditions"
          label="Состояние дороги"
          options={roadConditionsOptions.map((r) => ({ label: r, value: r }))}
          values={currentForm.road_conditions ?? []}
          onChange={(newValues) => updatePartialForm({ road_conditions: newValues })}
        />

        <Input
          id="vehicleBrand"
          label="Марка автомобиля"
          value={currentForm.vehicle_brand ?? ""}
          onChange={(e) => updatePartialForm({ vehicle_brand: e.target.value })}
        />
        <Input
          id="vehicleModel"
          label="Модель"
          value={currentForm.vehicle_model ?? ""}
          onChange={(e) => updatePartialForm({ vehicle_model: e.target.value })}
        />
        <Input
          id="vehicleColor"
          label="Цвет"
          value={currentForm.vehicle_color ?? ""}
          onChange={(e) => updatePartialForm({ vehicle_color: e.target.value })}
        />
        <Input
          id="vehicleYear"
          label="Год выпуска"
          type="number"
          min={0}
          value={currentForm.vehicle_year ?? 0}
          onChange={(e) => updatePartialForm({ vehicle_year: +e.target.value })}
        />
        <Input
          id="vehicleCategory"
          label="Категория ТС"
          value={currentForm.vehicle_category ?? ""}
          onChange={(e) => updatePartialForm({ vehicle_category: e.target.value })}
        />
        <Input
          id="ParticipantsCount"
          label="Кол-во участников"
          type="number"
          min={0}
          value={currentForm.participants_count ?? 0}
          onChange={(e) => updatePartialForm({ participants_count: +e.target.value })}
        />
        <Dropdown
          id="driverGender"
          label="Пол водителя"
          options={genderOptions}
          value={currentForm.driver_gender ?? ""}
          onChange={(val) => updatePartialForm({ driver_gender: val })}
        />
        <Input
          id="DrivingExperience"
          label="Стаж вождения"
          type="number"
          min={0}
          value={currentForm.driving_experience ?? 0}
          onChange={(e) => updatePartialForm({ driving_experience: +e.target.value })}
        />
      </div>
      <Button type="submit">Проверить</Button>
    </form>
  );
};

export default AccidentForm;
