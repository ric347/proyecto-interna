import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import GuardaDashboard from "./components/GuardaDashboard";
import ResidenteDashboard from "./components/ResidenteDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route
          path="/guarda"
          element={
            <ProtectedRoute role="guarda">
              <GuardaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/residente"
          element={
            <ProtectedRoute role="residente">
              <ResidenteDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
