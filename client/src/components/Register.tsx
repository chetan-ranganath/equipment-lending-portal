import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("student");
  const [phone, setPhone] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");

  const navigate = useNavigate();

  const PASSWORD_REGEX =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;

  const validatePassword = (pwd: string) => {
    if (!PASSWORD_REGEX.test(pwd)) {
      setPasswordError(
        "Password must be at least 8 chars, include uppercase, lowercase, number & special char"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(password)) return;

    try {
      const response = await fetch("http://localhost:9086/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "APIGW-tracking-header": generateAlphanumeric(10),
        },
        body: JSON.stringify({ username, password, role, phone }),
      });

      if (response && !response.ok) {
        const error: { code: string; message: string } = await response.json();
        throw new Error(error.message);
      }

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Register failed:", error);
      alert("Register failed: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="portal-title">Create Your Account</h2>
        <p className="portal-subtitle">Sign up to access the portal</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <small className="text-danger">{passwordError}</small>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Role (student/admin)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" className="btn-login">
              Register
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <h4 className="mb-3">Registration Successful!</h4>
              <p>Redirecting to login...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateAlphanumeric(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default Register;
