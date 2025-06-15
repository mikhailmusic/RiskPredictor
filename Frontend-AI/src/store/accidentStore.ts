import { create } from "zustand";
import { AccidentFormData } from "../api/types";
import { v4 as uuidv4 } from "uuid";

const getDefaultFormData = (): AccidentFormData => ({
  point_lat: 0,
  point_long: 0,
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

export interface AccidentData {
  id: string;
  form: AccidentFormData;
}

interface AccidentStore {
  currentForm: AccidentFormData;
  history: AccidentData[];

  setCurrentForm: (data: AccidentFormData) => void;
  updatePartialForm: (patch: Partial<AccidentFormData>) => void;

  addToHistory: () => void;
  loadFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useAccidentStore = create<AccidentStore>((set, get) => ({
  currentForm: getDefaultFormData(),
  history: JSON.parse(localStorage.getItem("accident-history") || "[]"),

  setCurrentForm: (data) => set({ currentForm: data }),
  updatePartialForm: (patch: Partial<AccidentFormData>) =>
    set((state) => ({
      currentForm: { ...state.currentForm, ...patch }
    })),

  addToHistory: () => {
    const form = get().currentForm;
    const newEntry: AccidentData = {
      id: uuidv4(),
      form
    };

    const updated = [newEntry, ...get().history];
    set({ history: updated });
    localStorage.setItem("accident-history", JSON.stringify(updated));
  },

  loadFromHistory: (id) => {
    const item = get().history.find((i) => i.id === id);
    if (item) {
      set({ currentForm: item.form });
    }
  },

  clearHistory: () => {
    set({ history: [] });
    localStorage.removeItem("accident-history");
  }
}));
