import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login.tsx";
import RegisterForm from "./components/Register.tsx";
import Dashboard from "./components/Dashboard.tsx";
import CartPage from "./components/Cartpage.tsx";
import RequestsPage from "./components/RequestPage.tsx";
import AdminRequestsPage from "./components/AdminRequestsPage.tsx";
import ReturnEquipmentPage from "./components/ReturnEquipmentPage.tsx";
import { CartProvider } from "./components/CartContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <CartProvider>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="requests" element={<RequestsPage />} />

                  {/* ✅ Admin-only */}
                  <Route
                    path="admin/requests"
                    element={<AdminRequestsPage />}
                  />

                  {/* ✅ Return Equipment for all users */}
                  <Route path="return" element={<ReturnEquipmentPage />} />
                </Routes>
              </CartProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
