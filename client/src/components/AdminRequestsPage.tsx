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

function AdminRequestsPage() {
  const [requests, setRequests] = useState<CartRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "denied" | "return"
  >("pending");

  const token = localStorage.getItem("jwtToken");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:9086/api/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch requests");

      const data = await response.json();
      setRequests(data);
    } catch (err: any) {
      console.error(err);
      setError("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    id: string,
    action: "approve" | "deny" | "received"
  ) => {
    try {
      const endpoint =
        action === "received"
          ? `/api/requests/${id}/return`
          : `/api/requests/${id}/${action}`;

      const response = await fetch(`http://localhost:9086${endpoint}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to ${action} request`);

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? {
                ...req,
                status:
                  action === "received" ? "RETURNED" : action.toUpperCase(),
              }
            : req
        )
      );
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} request.`);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading)
    return (
      <>
        <NavBar />
        <div className="container text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading requests...</p>
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

  let filteredRequests: CartRequest[] = [];
  if (activeTab === "pending") {
    filteredRequests = requests.filter(
      (r) => r.status?.toLowerCase() === "pending"
    );
  } else if (activeTab === "approved") {
    filteredRequests = requests.filter(
      (r) => r.status?.toLowerCase() === "approved"
    );
  } else if (activeTab === "denied") {
    filteredRequests = requests.filter(
      (r) => r.status?.toLowerCase() === "denied"
    );
  } else if (activeTab === "return") {
    filteredRequests = requests
      .filter(
        (r) =>
          r.status?.toLowerCase() === "return_requested" ||
          r.status?.toLowerCase() === "returned"
      )
      .sort((a, b) => {
        const statusOrder: { [key: string]: number } = {
          return_requested: 0,
          returned: 1,
        };
        return (
          (statusOrder[a.status.toLowerCase()] ?? 99) -
          (statusOrder[b.status.toLowerCase()] ?? 99)
        );
      });
  }

  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <span className="badge bg-success">Approved</span>;
      case "denied":
        return <span className="badge bg-danger">Denied</span>;
      case "return_requested":
        return (
          <span className="badge bg-warning text-dark">Return Pending</span>
        );
      case "returned":
        return <span className="badge bg-info text-dark">Returned</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4 mb-5">
        <h2 className="fw-bold mb-4 text-center">
          📋 Manage Equipment Requests
        </h2>

        {/* Tabs */}
        <ul className="nav nav-tabs justify-content-center mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "approved" ? "active" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              Approved
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "denied" ? "active" : ""}`}
              onClick={() => setActiveTab("denied")}
            >
              Denied
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "return" ? "active" : ""}`}
              onClick={() => setActiveTab("return")}
            >
              Return Requests
            </button>
          </li>
        </ul>

        {filteredRequests.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
              alt="No requests"
              style={{ width: "120px", opacity: 0.7 }}
            />
            <p className="mt-3 fs-5">
              No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              requests found.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Request ID</th>
                  <th>User</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Items</th>
                  {activeTab === "pending" && <th>Actions</th>}
                  {activeTab === "return" && <th>Return</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.username}</td>
                    <td>{req.purpose}</td>
                    <td>{statusBadge(req.status)}</td>
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
                    {activeTab === "pending" && (
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleAction(req.id, "approve")}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(req.id, "deny")}
                        >
                          ❌ Deny
                        </button>
                      </td>
                    )}
                    {activeTab === "return" && (
                      <td>
                        {req.status.toLowerCase() === "return_requested" ? (
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleAction(req.id, "received")}
                          >
                            ✅ Received
                          </button>
                        ) : (
                          <span className="text-success fw-bold">Returned</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminRequestsPage;
