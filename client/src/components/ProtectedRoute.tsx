import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowModal(true);
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000); // redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <>
        {showModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4 text-center border-danger">
                <h4 className="text-danger mb-3">Access Denied</h4>
                <p>
                  You must be logged in to view this page. Redirecting to
                  login...
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
