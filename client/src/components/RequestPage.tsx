import { useEffect, useState } from "react";
import NavBar from "./Navbar";

interface Equipment {
  equipmentId: string;
  name: string;
  category: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: string;
  imageUrl: string;
  available: boolean;
}

interface CartRequestItem {
  equipment: Equipment;
  requestedQuantity: number;
}

interface CartRequest {
  id: string;
  username: string;
  status: string;
  purpose: string;
  requestedAt: string;
  returnDate?: string;
  items: CartRequestItem[];
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<CartRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("jwtToken");

      if (!username || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:9086/api/requests/user/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: CartRequest[] = await response.json();
          setRequests(data);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (requestId: string) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:9086/api/requests/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        console.error("Failed to delete request");
      }
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4 mb-5">
        <h2 className="fw-bold mb-4 text-center">My Equipment Requests</h2>

        {loading ? (
          <p className="text-center text-muted mt-5">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076509.png"
              alt="No requests"
              style={{ width: "120px", opacity: 0.7 }}
            />
            <p className="mt-3 fs-5">No requests yet.</p>
            <p className="text-secondary">
              Once you submit a request from your cart, it’ll appear here.
            </p>
          </div>
        ) : (
          <div className="row">
            {requests.map((req: CartRequest) => (
              <div key={req.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold mb-1">{req.purpose}</h5>
                    <p className="text-muted small mb-2">
                      Requested on:{" "}
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </p>

                    {req.returnDate && (
                      <p className="text-muted small mb-2">
                        Return by:{" "}
                        {new Date(req.returnDate).toLocaleDateString()}
                      </p>
                    )}

                    <span
                      className={`badge ${
                        req.status.toUpperCase() === "APPROVED"
                          ? "bg-success"
                          : req.status.toUpperCase() === "DENIED"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      } align-self-start mb-3`}
                    >
                      {req.status}
                    </span>

                    {/* Delete button for pending requests */}
                    {req.status.toUpperCase() === "PENDING" && (
                      <button
                        className="btn btn-sm btn-outline-danger mb-3"
                        onClick={() => handleDelete(req.id)}
                      >
                        Delete Request
                      </button>
                    )}

                    <div className="border-top pt-2 small text-secondary">
                      {req.items.map((it: CartRequestItem, idx: number) => (
                        <div key={idx} className="mb-2">
                          <strong>{it.equipment.name}</strong> —{" "}
                          {it.requestedQuantity} pcs
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
