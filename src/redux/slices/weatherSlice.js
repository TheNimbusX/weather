// weatherStateManager.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const WEATHER_API_KEY = "457189a0b85bc3c13e4d8e7caef30693";
const BASE_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

// ============== LocalStorage Helper Functions ==============
const localStorageHelper = {
  getFavorites: () => {
    return getFromStorage("favorites", []);
  },

  saveFavorites: (favorites) => {
    saveToStorage("favorites", favorites);
  },

  getMainCities: () => {
    return getFromStorage("mainPageCities", []);
  },

  saveMainCities: (cities) => {
    saveToStorage("mainPageCities", cities);
  },
};

function getFromStorage(key, defaultValue) {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// ============== Weather API Functions ==============
const weatherApi = {
  fetchByCity: async (city) => {
    const url = `${BASE_WEATHER_API_URL}/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}&lang=ru`;
    return fetchWeatherData(url, "Город не найден");
  },

  fetchForecastById: async (id) => {
    const url = `${BASE_WEATHER_API_URL}/forecast?id=${id}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`;
    return fetchWeatherData(url, "Forecast not found");
  },

  fetchMultipleByIds: async (ids) => {
    if (!ids || ids.length === 0) return { list: [] };

    const url = `${BASE_WEATHER_API_URL}/group?id=${ids.join(
      ","
    )}&units=metric&appid=${WEATHER_API_KEY}&lang=ru`;
    return fetchWeatherData(url, "Failed to fetch cities data");
  },
};

async function fetchWeatherData(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return await response.json();
}

// ============== Async Thunks ==============
export const fetchCityWeather = createAsyncThunk(
  "weather/fetchCity",
  weatherApi.fetchByCity
);

export const fetchForecast = createAsyncThunk(
  "weather/fetchForecast",
  weatherApi.fetchForecastById
);

export const fetchMultipleWeather = createAsyncThunk(
  "weather/fetchMultiple",
  weatherApi.fetchMultipleByIds
);

export const refreshFavorites = createAsyncThunk(
  "weather/refreshFavorites",
  async (_, { getState, dispatch }) => {
    const { favorites } = getState().weather;
    const favoriteIds = favorites.map((city) => city.id);

    if (favoriteIds.length === 0) return [];

    const result = await dispatch(fetchMultipleWeather(favoriteIds));

    if (fetchMultipleWeather.fulfilled.match(result)) {
      return result.payload.list || [];
    }

    return [];
  }
);

// ============== Initial State ==============
const initialState = {
  currentData: null,
  searchResults: [],
  favorites: [],
  mainCities: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

// ============== Slice Definition ==============
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    initializeStorageData: (state) => {
      state.favorites = localStorageHelper.getFavorites();
      state.mainCities = localStorageHelper.getMainCities();
    },

    resetSearch: (state) => {
      state.searchResults = [];
    },

    addFavorite: (state, action) => {
      if (!state.favorites.some((city) => city.id === action.payload.id)) {
        state.favorites.push(action.payload);
        localStorageHelper.saveFavorites(state.favorites);
      }
    },

    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter((city) => city.id !== action.payload);
      localStorageHelper.saveFavorites(state.favorites);
    },

    addMainCity: (state, action) => {
      if (!state.mainCities.some((city) => city.id === action.payload.id)) {
        state.mainCities.push(action.payload);
        localStorageHelper.saveMainCities(state.mainCities);
      }
    },

    removeMainCity: (state, action) => {
      state.mainCities = state.mainCities.filter((city) => city.id !== action.payload);
      localStorageHelper.saveMainCities(state.mainCities);
    },
  },
  extraReducers: (builder) => {
    // Shared pending/rejected handlers
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Weather data request failed";
    };

    // Fetch city weather
    builder.addCase(fetchCityWeather.pending, handlePending);
    builder.addCase(fetchCityWeather.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResults = [action.payload];
    });
    builder.addCase(fetchCityWeather.rejected, handleRejected);

    // Fetch forecast
    builder.addCase(fetchForecast.pending, handlePending);
    builder.addCase(fetchForecast.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentData = action.payload;
    });
    builder.addCase(fetchForecast.rejected, handleRejected);

    // Refresh favorites
    builder.addCase(refreshFavorites.pending, (state) => {
      state.isUpdating = true;
    });
    builder.addCase(refreshFavorites.fulfilled, (state, action) => {
      state.isUpdating = false;

      action.payload.forEach((updatedCity) => {
        const index = state.favorites.findIndex((city) => city.id === updatedCity.id);
        if (index !== -1) {
          state.favorites[index] = updatedCity;
        }
      });

      localStorageHelper.saveFavorites(state.favorites);
    });
    builder.addCase(refreshFavorites.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.error.message || "Failed to refresh favorites";
    });
  },
});

export const {
  initializeStorageData,
  resetSearch,
  addFavorite,
  removeFavorite,
  addMainCity,
  removeMainCity,
} = weatherSlice.actions;

export default weatherSlice.reducer;
