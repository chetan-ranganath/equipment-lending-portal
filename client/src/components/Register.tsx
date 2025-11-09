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

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("here");
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
    <>
      <div className="register-page">
        <h1>Glad to see you again! </h1>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail2"
              aria-describedby="emailHelp"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail3"
              aria-describedby="emailHelp"
              placeholder="Enter Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>
          <div className="button-row">
            <div className="form-group form-check">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <h4 className="mb-3">Registration Successful!</h4>
              <p>Redirecting you to login...</p>
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
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export default Register;
