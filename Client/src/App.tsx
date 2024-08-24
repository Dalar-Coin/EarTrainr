import "./App.css";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { useAuth } from './context/useAuth';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Peaks from "./pages/Peaks.tsx";
import PeaksConfig from "./pages/PeaksConfig.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/peaks" element={<ProtectedRoute><Peaks /></ProtectedRoute>} />
          <Route path="/peaksConfig" element={<ProtectedRoute><PeaksConfig /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;