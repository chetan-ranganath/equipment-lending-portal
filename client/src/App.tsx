import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login.tsx";
import RegisterForm from "./components/Register.tsx";
import Dashboard from "./components/Dashboard.tsx";
import CartPage from "./components/Cartpage.tsx";
import { CartProvider } from "./components/CartContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <CartProvider>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="cart" element={<CartPage />} />
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
