import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchForecast,
  addFavorite,
  removeFavorite,
} from "../../redux/slices/weatherSlice.js";
import { ArrowLeft, Heart, Cloud, Wind, Droplets, Thermometer } from "lucide-react";
import styles from "../../assets/styles/pages/CityDetailsPage.module.scss";

const CityDetailsPage = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentData: forecastData,
    favorites,
    isLoading,
    error,
  } = useSelector((state) => state.weather);

  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState({
    morning: null,
    day: null,
    evening: null,
    night: null,
  });

  const isFavorite =
    forecastData && favorites.some((city) => city.id === forecastData.city.id);

  useEffect(() => {
    if (cityId) {
      dispatch(fetchForecast(Number(cityId)));
    }
  }, [dispatch, cityId]);

  useEffect(() => {
    if (forecastData?.list) {
      updateWeatherStates(forecastData);
    }
  }, [forecastData]);

  const updateWeatherStates = (data) => {
    setDailyForecast(getDailyForecastParts(data));
    setCurrentWeather(getCurrentWeather(data));
  };

  const getCurrentWeather = (data) => {
    const now = Math.floor(Date.now() / 1000);
    let closestForecast = data.list.reduce((prev, curr) => {
      return Math.abs(curr.dt - now) < Math.abs(prev.dt - now) ? curr : prev;
    }, data.list[0]);

    return {
      temp: closestForecast.main.temp,
      feelsLike: closestForecast.main.feels_like,
      pressure: closestForecast.main.pressure,
      humidity: closestForecast.main.humidity,
      description: closestForecast.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${closestForecast.weather[0].icon}@2x.png`,
      windSpeed: closestForecast.wind.speed,
    };
  };

  const getDailyForecastParts = (data) => {
    const parts = { morning: null, day: null, evening: null, night: null };

    data.list.forEach((item) => {
      const hour = new Date(item.dt * 1000).getHours();

      if (hour >= 6 && hour < 12) parts.morning = item;
      else if (hour >= 12 && hour < 18) parts.day = item;
      else if (hour >= 18 && hour < 24) parts.evening = item;
      else if (hour >= 0 && hour < 6) parts.night = item;
    });

    return parts;
  };

  const handleFavoriteToggle = () => {
    if (!forecastData) return;

    const action = isFavorite
      ? removeFavorite(forecastData.city.id)
      : addFavorite(forecastData);

    dispatch(action);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className={styles.errorContainer}>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          Вернуться на главную
        </button>
        <div className={styles.errorMessage}>
          Не удалось загрузить данные о городе. Пожалуйста, попробуйте снова.
        </div>
      </div>
    );
  }

  const timeOfDayLabels = {
    morning: "Утро",
    day: "День",
    evening: "Вечер",
    night: "Ночь",
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        <ArrowLeft className={styles.backIcon} />
        Вернуться на главную
      </button>

      <div className={styles.weatherCard}>
        <div className={styles.weatherHeader}>
          <h2>{forecastData.city.name}</h2>
        </div>

        <div className={styles.weatherMain}>
          <div className={styles.weatherPrimary}>
            <img
              src={currentWeather.icon}
              alt={currentWeather.description}
              className={styles.weatherIcon}
            />
            <span className={styles.temperature}>
              {Math.round(currentWeather.temp)}°C
            </span>
            <span className={styles.description}>{currentWeather.description}</span>
          </div>

          <div className={styles.weatherDetails}>
            <div className={styles.detailItem}>
              <Thermometer className={styles.detailIcon} />
              Ощущается как: {Math.round(currentWeather.feelsLike)}°C
            </div>
            <div className={styles.detailItem}>
              <Droplets className={styles.detailIcon} />
              Влажность: {currentWeather.humidity}%
            </div>
            <div className={styles.detailItem}>
              <Wind className={styles.detailIcon} />
              Ветер: {Math.round(currentWeather.windSpeed)} м/с
            </div>
            <div className={styles.detailItem}>
              <Cloud className={styles.detailIcon} />
              Давление: {currentWeather.pressure} гПа
            </div>
          </div>
        </div>

        <div className={styles.forecastSection}>
          <h3 className={styles.forecastTitle}>Прогноз на ближайшие сутки</h3>
          <div className={styles.forecastGrid}>
            {Object.entries(dailyForecast).map(
              ([timeKey, forecast]) =>
                forecast && (
                  <div key={timeKey} className={styles.forecastCard}>
                    <h4 className={styles.forecastTime}>{timeOfDayLabels[timeKey]}</h4>
                    <img
                      src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                      alt={forecast.weather[0].description}
                      className={styles.forecastIcon}
                    />
                    <div className={styles.forecastTemp}>
                      {Math.round(forecast.main.temp)}°C
                    </div>
                    <div className={styles.forecastDesc}>
                      {forecast.weather[0].description}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailsPage;
