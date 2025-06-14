import api from "./axios";
import { AccidentFormData, AllowedValuesContract } from "./types";


export const fetchAccidentContract = async (): Promise<AllowedValuesContract> => {
  const res = await api.get('/contract');
  return res.data;
};


export const predictAccidentRisk = async (form: AccidentFormData): Promise<number> => {
  const payload = transformToBackend(form);
  const response = await api.post('/predict', payload);

  return response.data.risk;
};

const transformToBackend = (form: AccidentFormData) => ({
  point_lat: form.point_lat,
  point_long: form.point_long,
  weather: form.weather,
  road_conditions: form.road_conditions,
  vehicle_year: form.vehicle_year,
  vehicle_brand: form.vehicle_brand,
  vehicle_color: form.vehicle_color,
  vehicle_model: form.vehicle_model,
  vehicle_category_grouped: form.vehicle_category,
  vehicle_participants_count: form.participants_count,
  driver_gender: form.driver_gender,
  driver_years_of_driving_experience: form.driving_experience,
  day_of_week: form.day_of_week,
  time_of_day: form.time_of_day
});