export type AccidentFormData = {
  point_lat: number; 
  point_long: number;
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

export const genderOptions = [
  { label: "Мужской", value: "Мужской" },
  { label: "Женский", value: "Женский" }
];

export const timeOfDayOptions = [
  { label: "Утро", value: "Утро" },
  { label: "День", value: "День" },
  { label: "Вечер", value: "Вечер" },
  { label: "Ночь", value: "Ночь" }
];

export const weatherOptions = ["Солнечно", "Дождь", "Снег", "Пасмурно"];
export const roadConditionsOptions = ["Сухое", "Мокрое", "Заснеженное", "Гололёд"];

