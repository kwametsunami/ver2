import "../src/styles/styles.scss";

import { Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Search from "./components/Search";
import NotFound from "./components/NotFound";

const App = () => {
  const browserKey = () => {
    const anonKey = uuidv4();
    return anonKey;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Search anonKey={browserKey()} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
