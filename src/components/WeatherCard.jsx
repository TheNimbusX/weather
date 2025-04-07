import { useDispatch, useSelector } from "react-redux";
import { memo } from "react";
import { Link } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
  addMainCity,
  removeMainCity,
} from "../redux/slices/weatherSlice";
import styles from "../assets/styles/components/WeatherCard.module.scss";

const WeatherCard = ({ city, isMainSection = false }) => {
  const dispatch = useDispatch();
  const { favorites, mainCities } = useSelector((state) => state.weather);

  const isFavorite = favorites.some((favorite) => favorite.id === city.id);
  const isOnMain = mainCities.some((mainCity) => mainCity.id === city.id);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const action = isFavorite ? removeFavorite(city.id) : addFavorite(city);
    dispatch(action);
  };

  const handleMainToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOnMain) {
      dispatch(removeMainCity(city.id));
      if (isFavorite) dispatch(removeFavorite(city.id));
    } else {
      dispatch(addMainCity(city));
    }
  };
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("ru-RU");
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Link to={`/city/${city.id}`} className={styles.flex}>
      <div className={styles.card}>
        {/* Кнопка добавления на главную */}
        <div
          onClick={handleMainToggle}
          className={styles.mainPageIcon}
          style={{
            transform: isOnMain ? "rotate(45deg)" : "none",
            transition: "transform 0.3s ease",
            position: "absolute",
            top: "2rem",
            left: "2rem",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Complete">
              <g data-name="add" id="add-2">
                <g>
                  <line
                    fill="none"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    x1="12"
                    x2="12"
                    y1="19"
                    y2="5"
                  />
                  <line
                    fill="none"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    x1="5"
                    x2="19"
                    y1="12"
                    y2="12"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Кнопка избранного */}
        <div onClick={handleFavoriteToggle} className={styles.favIcon}>
          <svg
            height="20px"
            width="20px"
            viewBox="0 0 512 512"
            style={{ enableBackground: "new 0 0 512 512" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M365.4,59.628c60.56,0,109.6,49.03,109.6,109.47c0,109.47-109.6,171.8-219.06,281.271C146.47,340.898,37,278.568,37,169.099c0-60.44,49.04-109.47,109.47-109.47c54.73,0,82.1,27.37,109.47,82.1C283.3,86.999,310.67,59.628,365.4,59.628z"
              fill={isFavorite ? "rgba(255, 99, 71)" : "transparent"}
              stroke={isFavorite ? "none" : "rgba(0, 0, 0, 0.5)"}
              strokeWidth={isFavorite ? "0" : "30px"}
            />
          </svg>
        </div>
        <div className={styles.card__name}>
          <div className={styles.card__name_icon}>
            <img src={getWeatherIconUrl(city.weather[0].icon) || ""} alt="" />
          </div>
          <div className={styles.card__name_date}>
            <p>
              {city.name}, {city.sys?.country}
            </p>
            <span>{formatDate(city.dt)}</span>
          </div>
        </div>
        <div className={styles.card__weather}>
          <h3>{Math.round(city.main.temp)}</h3>
          <span>°C</span>
        </div>
        <div className={styles.card__desc}>{city.weather[0].description}</div>
      </div>
    </Link>
  );
};

export default memo(WeatherCard);
