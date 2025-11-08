import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./Navbar";
import DashboardCard from "./DashboardCard";
import { useEffect, useState, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import "../styles/Dashboard.css";

interface Equipment {
  equipmentId: string;
  name: string;
  category: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: string;
  available: boolean;
  imageUrl: string;
}

function Dashboard() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchEquipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:9086/api/equipments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setEquipments(data);
    } catch (err: any) {
      console.error("Error fetching equipments:", err);
      setError("Failed to fetch equipments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(equipments.map((e) => e.category)));
    return ["All", ...cats];
  }, [equipments]);

  const filteredEquipments = useMemo(() => {
    return equipments.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [equipments, search, selectedCategory]);

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <h2 className="fw-bold text-center text-md-start mb-3 mb-md-0">
            Available Equipments
          </h2>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control custom-search"
              placeholder="Search equipments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: "200px" }}
            />

            <select
              className="form-select custom-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Fetching available equipments...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-5">
            <p className="text-danger">{error}</p>
            <button
              className="btn btn-outline-primary"
              onClick={fetchEquipments}
            >
              Retry
            </button>
          </div>
        ) : filteredEquipments.length === 0 ? (
          <div className="text-center mt-5 text-muted">
            <h5>No equipments found.</h5>
            <p>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="row">
            {filteredEquipments.map((item) => (
              <div key={item.equipmentId} className="col-md-4 col-sm-6 mb-4">
                <DashboardCard equipment={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
