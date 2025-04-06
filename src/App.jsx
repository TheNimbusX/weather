import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import styles from "./assets/styles/App.module.scss";
import Home from "./pages/Home/Home";
import CityDetailsPage from "./pages/CityDetailsPage/CityDetailsPage";

function App() {
  return (
    <Router>
      <div className={styles.intro}>
        <div className={styles.intro__wrapper}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/city/:cityId" element={<CityDetailsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
