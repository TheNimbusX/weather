import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSearch,
  fetchCityWeather,
  initializeStorageData,
  addMainCity,
  removeMainCity,
} from "../../redux/slices/weatherSlice.js";
import SearchBar from "../../components/SearchBar";
import WeatherCard from "../../components/WeatherCard";
import FavoritesList from "../../components/FavoritesList";
import styles from "../../assets/styles/pages/Home.module.scss";

const HomePage = () => {
  const dispatch = useDispatch();
  const { searchResults, favorites, mainCities, isLoading, error } = useSelector(
    (state) => state.weather
  );

  const [searchError, setSearchError] = useState(""); // состояние для ошибки поиска

  useEffect(() => {
    dispatch(initializeStorageData());
  }, [dispatch]);

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchError(""); // сбрасываем ошибку при вводе
      dispatch(fetchCityWeather(query));
    } else {
      setSearchError("Пожалуйста, введите корректное название города."); // устанавливаем ошибку, если ввод пустой
      dispatch(resetSearch());
    }
  };

  const renderSection = (title, cities, isMainSection = false) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.cardsGrid}>
        {cities.map((city) => (
          <WeatherCard key={city.id} city={city} isMainSection={isMainSection} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <SearchBar onSearch={handleSearch} />

      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      {/* Оповещение о некорректном вводе */}
      {searchError && (
        <div className={styles.errorMessage} role="alert">
          {searchError}
        </div>
      )}

      {mainCities.length > 0 && renderSection("", mainCities, true)}
    </div>
  );
};

export default HomePage;
