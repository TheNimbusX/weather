import React, { useEffect } from "react";
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

  useEffect(() => {
    dispatch(initializeStorageData());
  }, [dispatch]);

  const handleSearch = (query) => {
    if (query.trim()) {
      dispatch(fetchCityWeather(query));
    } else {
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

      {searchResults.length > 0 && renderSection("Результаты поиска", searchResults)}

      {mainCities.length > 0 && renderSection("Города на главной", mainCities, true)}

      {favorites.length > 0 && renderSection("Избранные города", favorites)}
    </div>
  );
};

export default HomePage;
