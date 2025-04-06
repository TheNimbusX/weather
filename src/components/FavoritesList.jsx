"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshFavorites } from "../redux/slices/weatherSlice";
import WeatherCard from "./WeatherCard";
import styles from "../assets/styles/components/FavoritesList.module.scss";

const FAVORITES_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutes

const FavoritesSection = () => {
  const dispatch = useDispatch();
  const { favorites, isUpdating } = useSelector((state) => state.weather);

  useEffect(() => {
    if (!favorites.length) return;

    // Initial update
    dispatch(refreshFavorites());

    // Set up periodic updates
    const intervalId = setInterval(() => {
      dispatch(refreshFavorites());
    }, FAVORITES_UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [dispatch, favorites.length]);

  if (!favorites.length) {
    return null;
  }

  return (
    <div>
      {updatingFavorites && (
        <div className={styles.loading}>
          <p className="text-sm text-gray-500">Обновление данных...</p>
        </div>
      )}

      <div className={styles.grid_container}>
        {favorites.map((city) => (
          <WeatherCard key={city.id} city={city} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;
