import "bootstrap/dist/css/bootstrap.css";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { jwtDecode } from "jwt-decode";

function NavBar() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    clearCart();
    navigate("/login");
  };

  const token = localStorage.getItem("jwtToken");
  let role: string | null = null;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand fw-bold fs-4">
          🧰 Equipment Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link active">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/requests" className="nav-link">
                Requests
              </Link>
            </li>

            {/* Show only for admins */}
            {role && role.toLowerCase() === "admin" && (
              <li className="nav-item">
                <Link to="/admin/requests" className="nav-link text-warning">
                  Approve/Deny Requests
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/cart" className="nav-link position-relative">
                🛒 Cart
                {cart.length > 0 && (
                  <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                    {cart.length}
                  </span>
                )}
              </Link>
            </li>

            <li className="nav-item dropdown ms-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                👤 Account
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
