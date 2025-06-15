import { useState, useEffect } from "react";
import { useAccidentStore } from "../../store/accidentStore";
import { predictAccidentRisk, fetchAccidentContract } from "../../api/accidentApi";
import { AllowedValuesContract } from "../../api/types";
import { getDayName } from "../../utils/dateUtils";
import Input from "../../components/Input/Input";
import Dropdown from "../../components/Dropdown/Dropdown";
import MultiDropdown from "../../components/Dropdown/MultiDropdown";
import Autocomplete from "../../components/Autocomplete/Autocomplete";
import Button from "../../components/Button/Button";
import "./accident.form.css";

const AccidentForm: React.FC = () => {
  const { currentForm, addToHistory, updatePartialForm } = useAccidentStore();
  const [contract, setContract] = useState<AllowedValuesContract | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [riskResult, setRiskResult] = useState<string | null>(null);

  useEffect(() => {
    const loadContract = async () => {
      try {
        const result = await fetchAccidentContract();
        setContract(result);
      } catch (err) {
        console.error("Ошибка загрузки схемы:", err);
        setErrors({ _contract: "Не удалось загрузить схему" });
      }
    };

    setErrors({});
    loadContract();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract) return;

    const isValid = validateForm();
    if (!isValid) return;

    try {
      const risk = await predictAccidentRisk(currentForm);
      setRiskResult(`Предсказанный риск: ${(risk * 100).toFixed(2)}%`);
      addToHistory();
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке данных");
    }
  };

  const validateForm = (): boolean => {
    if (!contract) return false;

    const newErrors: Record<string, string> = {};
    const f = currentForm;

    // Геокоординаты
    if (f.point_lat < contract.point_lat.min || f.point_lat > contract.point_lat.max) {
      newErrors.point_lat = `Широта вне диапазона (${contract.point_lat.min}–${contract.point_lat.max})`;
    }
    if (f.point_long < contract.point_long.min || f.point_long > contract.point_long.max) {
      newErrors.point_long = `Долгота вне диапазона (${contract.point_long.min}–${contract.point_long.max})`;
    }

    // Дата/время/погода/дорога
    if (!contract.time_of_day.includes(f.time_of_day)) {
      newErrors.time_of_day = "Недопустимое время суток";
    }
    if (!contract.day_of_week.includes(f.day_of_week)) {
      newErrors.day_of_week = "Недопустимый день недели";
    }
    if (!Array.isArray(f.weather) || f.weather.length === 0) {
      newErrors.weather = "Укажите погоду";
    } else if (!f.weather.every((w) => contract.weather.includes(w))) {
      newErrors.weather = "Недопустимая погода";
    }

    if (!Array.isArray(f.road_conditions) || f.road_conditions.length === 0) {
      newErrors.road_conditions = "Укажите состояние дороги";
    } else if (!f.road_conditions.every((r) => contract.road_conditions.includes(r))) {
      newErrors.road_conditions = "Недопустимое состояние дороги";
    }

    // Водитель
    if (!contract.driver_gender.includes(f.driver_gender)) {
      newErrors.driver_gender = "Недопустимый пол водителя";
    }
    if (
      f.driving_experience < contract.driver_years_of_driving_experience.min ||
      f.driving_experience > contract.driver_years_of_driving_experience.max
    ) {
      newErrors.driving_experience = `Стаж вождения вне диапазона (${contract.driver_years_of_driving_experience.min}–${contract.driver_years_of_driving_experience.max})`;
    }

    // Транспорт
    if (!contract.vehicle_brand.includes(f.vehicle_brand)) {
      newErrors.vehicle_brand = "Недопустимая марка";
    }
    if (!contract.vehicle_model.includes(f.vehicle_model)) {
      newErrors.vehicle_model = "Недопустимая модель";
    }
    if (!contract.vehicle_color.includes(f.vehicle_color)) {
      newErrors.vehicle_color = "Недопустимый цвет";
    }
    if (!contract.vehicle_category_grouped.includes(f.vehicle_category)) {
      newErrors.vehicle_category = "Недопустимая категория";
    }
    if (f.vehicle_year < contract.vehicle_year.min || f.vehicle_year > contract.vehicle_year.max) {
      newErrors.vehicle_year = `Год выпуска (${contract.vehicle_year.min}–${contract.vehicle_year.max})`;
    }
    if (f.participants_count < contract.vehicle_participants_count.min || f.participants_count > contract.vehicle_participants_count.max) {
      newErrors.participants_count = "Кол-во участников вне допустимого диапазона";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (errors._contract) {
    return <p>{errors._contract}</p>;
  }
  if (!contract) return <p>Загрузка...</p>;

  return (
    <form className="accident-form" onSubmit={handleSubmit} noValidate>
      <div className="coordinates-group">
        <Input
          id="pointLat"
          label="Широта"
          type="number"
          value={currentForm.point_lat ?? 0}
          onChange={(e) => updatePartialForm({ point_lat: +e.target.value })}
          error={errors.point_lat}
        />
        <Input
          id="pointLong"
          label="Долгота"
          type="number"
          value={currentForm.point_long ?? 0}
          onChange={(e) => updatePartialForm({ point_long: +e.target.value })}
          error={errors.point_long}
        />
      </div>

      <div className="fields-grid">
        <Dropdown
          id="dayOfWeek"
          label="День недели"
          options={contract.day_of_week.map((d) => ({
            value: d.toString(),
            label: getDayName(d)
          }))}
          value={currentForm.day_of_week?.toString() ?? ""}
          onChange={(val) => updatePartialForm({ day_of_week: +val })}
          error={errors.day_of_week}
        />

        <Dropdown
          id="timeOfDay"
          label="Время суток"
          options={contract.time_of_day.map((v) => ({ label: v, value: v }))}
          value={currentForm.time_of_day ?? ""}
          onChange={(val) => updatePartialForm({ time_of_day: val })}
          error={errors.time_of_day}
        />
        <MultiDropdown
          id="weather"
          label="Погода"
          options={contract.weather.map((v) => ({ label: v, value: v }))}
          values={currentForm.weather ?? []}
          onChange={(vals) => updatePartialForm({ weather: vals })}
          error={errors.weather}
        />
        <MultiDropdown
          id="roadConditions"
          label="Состояние дороги"
          options={contract.road_conditions.map((v) => ({ label: v, value: v }))}
          values={currentForm.road_conditions ?? []}
          onChange={(vals) => updatePartialForm({ road_conditions: vals })}
          error={errors.road_conditions}
        />

        <Autocomplete
          id="vehicleBrand"
          label="Марка автомобиля"
          options={contract.vehicle_brand}
          value={currentForm.vehicle_brand}
          onChange={(val) => updatePartialForm({ vehicle_brand: val })}
          error={errors.vehicle_brand}
        />

        <Autocomplete
          id="vehicleModel"
          label="Модель"
          options={contract.vehicle_model}
          value={currentForm.vehicle_model}
          onChange={(val) => updatePartialForm({ vehicle_model: val })}
          error={errors.vehicle_model}
        />

        <Dropdown
          id="vehicleColor"
          label="Цвет"
          options={contract.vehicle_color.map((color) => ({
            label: color,
            value: color
          }))}
          value={currentForm.vehicle_color ?? ""}
          onChange={(val) => updatePartialForm({ vehicle_color: val })}
          error={errors.vehicle_color}
        />
        <Input
          id="vehicleYear"
          label="Год выпуска"
          type="number"
          min={contract.vehicle_year.min}
          max={contract.vehicle_year.max}
          value={currentForm.vehicle_year ?? 0}
          onChange={(e) => updatePartialForm({ vehicle_year: +e.target.value })}
          error={errors.vehicle_year}
        />
        <Dropdown
          id="vehicleCategory"
          label="Категория ТС"
          options={contract.vehicle_category_grouped.map((v) => ({
            label: v,
            value: v
          }))}
          value={currentForm.vehicle_category ?? ""}
          onChange={(val) => updatePartialForm({ vehicle_category: val })}
          error={errors.vehicle_category}
        />
        <Input
          id="participantsCount"
          label="Кол-во пассажиров"
          type="number"
          min={contract.vehicle_participants_count.min}
          max={contract.vehicle_participants_count.max}
          value={currentForm.participants_count ?? 0}
          onChange={(e) => updatePartialForm({ participants_count: +e.target.value })}
          error={errors.participants_count}
        />
        <Dropdown
          id="driverGender"
          label="Пол водителя"
          options={contract.driver_gender.map((v) => ({ label: v, value: v }))}
          value={currentForm.driver_gender ?? ""}
          onChange={(val) => updatePartialForm({ driver_gender: val })}
          error={errors.driver_gender}
        />
        <Input
          id="drivingExperience"
          label="Стаж вождения"
          type="number"
          min={contract.driver_years_of_driving_experience.min}
          max={contract.driver_years_of_driving_experience.max}
          value={currentForm.driving_experience ?? 0}
          onChange={(e) => updatePartialForm({ driving_experience: +e.target.value })}
          error={errors.driving_experience}
        />
      </div>

      <div className="risk-result">
        <p>{riskResult}</p>
        <Button type="submit">Проверить</Button>
      </div>
    </form>
  );
};

export default AccidentForm;
