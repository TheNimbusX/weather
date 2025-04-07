import { useState, memo } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCityWeather, addMainCity } from "../redux/slices/weatherSlice"; // Импортируем необходимые экшены
import styles from "../assets/styles/components/SearchBar.module.scss";

const SearchInput = ({ onSearch }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { mainCities } = useSelector((state) => state.weather); // Получаем список городов на главной странице

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // Запрашиваем погоду для города
        const response = await dispatch(fetchCityWeather(searchQuery.trim()));
        const city = response.payload;

        dispatch(addMainCity(city));
        setSearchQuery("");
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSearchSubmit} className={styles.form} role="search">
      <div className={styles.form__wrapper}>
        <input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Введите город"
          className={styles.search__input}
          aria-label="Поиск города"
        />
        <button
          type="submit"
          className={styles.search__button}
          aria-label="Найти"
          disabled={!searchQuery.trim()}
        >
          <Search size={20} className={styles.searchIcon} />
        </button>
      </div>
    </form>
  );
};

export default memo(SearchInput);
