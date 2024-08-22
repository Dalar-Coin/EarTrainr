import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Peaks from "./pages/Peaks.tsx";
import PeaksConfig from "./pages/PeaksConfig.tsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/peaks" element={<Peaks />} />
          <Route path="/peaksConfig" element={<PeaksConfig />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
