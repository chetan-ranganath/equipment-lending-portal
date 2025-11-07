import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login.tsx";
import RegisterForm from "./components/Register.tsx";
import Dashboard from "./components/Dashboard.tsx";
import EquipmentDashboardApp from './EquipmentDashboardApp';


function App() {
   return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipment-portal/*" element={<EquipmentDashboardApp />} />
      </Routes>
    </Router>
  );
}

export default App
