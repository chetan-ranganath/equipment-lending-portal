import { useEffect, useState } from "react";
import NavBar from "./Navbar";

interface Equipment {
  equipmentId: string;
  name: string;
  category: string;
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

export default function ReturnEquipmentPage() {
  const [requests, setRequests] = useState<CartRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningIds, setReturningIds] = useState<string[]>([]); // track returns in progress

  const token = localStorage.getItem("jwtToken");
  const username = localStorage.getItem("username");

  const fetchApprovedRequests = async () => {
    if (!token || !username) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:9086/api/requests/user/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch requests");

      const data = await response.json();
      // Only approved requests
      const approved = data.filter(
        (req: CartRequest) => req.status?.toLowerCase() === "approved"
      );
      setRequests(approved);
    } catch (err) {
      console.error(err);
      setError("Failed to load approved requests");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id: string) => {
    if (!token) return;

    try {
      setReturningIds((prev) => [...prev, id]); // mark as pending
      const response = await fetch(
        `http://localhost:9086/api/requests/${id}/request-return`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to return equipment");

      // After success, keep ID in returningIds to show "Return pending"
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req } : req))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to return equipment.");
      // remove from pending on failure
      setReturningIds((prev) => prev.filter((rid) => rid !== id));
    }
  };

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  if (loading)
    return (
      <>
        <NavBar />
        <div className="container text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading approved requests...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <NavBar />
        <div className="container text-center mt-5 text-danger">{error}</div>
      </>
    );

  if (requests.length === 0)
    return (
      <>
        <NavBar />
        <div className="container text-center mt-5 text-muted">
          <p>No approved requests to return.</p>
        </div>
      </>
    );

  return (
    <>
      <NavBar />
      <div className="container mt-4 mb-5">
        <h2 className="fw-bold mb-4 text-center">🔄 Return Equipment</h2>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Request ID</th>
                <th>Purpose</th>
                <th>Items</th>
                <th>Return By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.purpose}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {req.items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.equipment.name}</strong> —{" "}
                          {item.requestedQuantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {req.returnDate
                      ? new Date(req.returnDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {returningIds.includes(req.id) ? (
                      <span className="badge bg-warning text-dark">
                        Return pending
                      </span>
                    ) : (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleReturn(req.id)}
                      >
                        🔄 Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
