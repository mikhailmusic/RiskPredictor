export type AllowedValuesContract = {
  weather: string[];
  road_conditions: string[];
  time_of_day: string[];
  driver_gender: string[];
  vehicle_color: string[];
  vehicle_category_grouped: string[];
  day_of_week: number[];
  vehicle_year: {
    min: number;
    max: number;
  };
  vehicle_participants_count: {
    min: number;
    max: number;
  };
  driver_years_of_driving_experience: {
    min: number;
    max: number;
  };
  point_lat: {
    min: number;
    max: number;
  };
  point_long: {
    min: number;
    max: number;
  };
  vehicle_info: Record<string, string[]>;
};


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
