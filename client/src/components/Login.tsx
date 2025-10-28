import "bootstrap/dist/css/bootstrap.css";
import "../styles/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setModalInfo({ type: null, message: "" });

    try {
      const response = await fetch("http://localhost:9086/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "APIGW-tracking-header": generateAlphanumeric(10),
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error: { message?: string } = await response.json();
        throw new Error(error.message || "Invalid credentials");
      }

      const data: { token: string } = await response.json();
      localStorage.setItem("jwtToken", data.token);

      setModalInfo({
        type: "success",
        message: `Welcome back, ${username}! Redirecting to your dashboard...`,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Login failed:", error);
      setModalInfo({
        type: "error",
        message: error.message || "Login failed. Please try again.",
      });

      setTimeout(() => setModalInfo({ type: null, message: "" }), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <h1>Welcome Back!</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="button-row">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/register")}
              disabled={loading}
            >
              Register
            </button>
          </div>
        </form>
      </div>

      {modalInfo.type && (
        <div
          className="modal fade show custom-fade"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.6)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content text-center p-4 ${
                modalInfo.type === "success"
                  ? "border-success"
                  : "border-danger"
              }`}
            >
              <h4
                className={`mb-3 ${
                  modalInfo.type === "success" ? "text-success" : "text-danger"
                }`}
              >
                {modalInfo.type === "success" ? "Success" : "Error"}
              </h4>
              <p>{modalInfo.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function generateAlphanumeric(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
}

export default LoginForm;
