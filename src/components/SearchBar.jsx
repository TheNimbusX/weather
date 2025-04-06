import { useState, memo } from "react";
import { Search } from "lucide-react";
import styles from "../assets/styles/components/SearchBar.module.scss";

const SearchInput = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
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
