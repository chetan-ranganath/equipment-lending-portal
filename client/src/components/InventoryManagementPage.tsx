import "bootstrap/dist/css/bootstrap.css";
import "../styles/Navbar.css";
import NavBar from "./Navbar.tsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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

const categories = ["SPORTS", "LAB", "MUSIC", "CAMERA", "ELECTRONICS", "OTHER"];
const conditions = ["GOOD", "FAIR", "POOR"];

const InventoryManagementPage = () => {
  const [activeTab, setActiveTab] = useState<"add" | "update" | "delete">(
    "add"
  );
  const [form, setForm] = useState<Partial<Equipment>>({
    name: "",
    category: "OTHER",
    description: "",
    totalQuantity: 0,
    availableQuantity: 0,
    condition: "GOOD",
    imageUrl: "",
  });
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [updateId, setUpdateId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string>("");

  const fetchEquipments = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch("http://localhost:9086/api/equipments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEquipmentList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes("Quantity") ? Number(value) : value,
    }));
  };

  const handleAdd = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.totalQuantity ||
      !form.availableQuantity
    ) {
      alert("Please fill all mandatory fields!");
      return;
    }

    const payload: Equipment = {
      ...form,
      equipmentId: uuidv4(),
      available: form.availableQuantity! > 0,
      imageUrl: form.imageUrl || "",
    } as Equipment;

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch("http://localhost:9086/api/equipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Equipment added successfully!");
        setForm({
          name: "",
          category: "OTHER",
          description: "",
          totalQuantity: 0,
          availableQuantity: 0,
          condition: "GOOD",
          imageUrl: "",
        });
        fetchEquipments();
      } else alert("Failed to add equipment");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUpdate = (id: string) => {
    setUpdateId(id);
    const eq = equipmentList.find((e) => e.equipmentId === id);
    if (eq) setForm({ ...eq });
  };

  const handleUpdate = async () => {
    if (!updateId) return alert("Select equipment to update");

    const payload: Equipment = {
      ...form,
      equipmentId: updateId,
      available: form.availableQuantity! > 0,
      imageUrl: form.imageUrl || "",
    } as Equipment;

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(
        `http://localhost:9086/api/equipments/${updateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        alert("Equipment updated successfully!");
        setUpdateId("");
        setForm({
          name: "",
          category: "OTHER",
          description: "",
          totalQuantity: 0,
          availableQuantity: 0,
          condition: "GOOD",
          imageUrl: "",
        });
        fetchEquipments();
      } else alert("Failed to update equipment");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return alert("Select equipment to delete");

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(
        `http://localhost:9086/api/equipments/${deleteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        alert("Equipment deleted successfully!");
        setDeleteId("");
        fetchEquipments();
      } else alert("Failed to delete equipment");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h2 className="mb-4">Inventory Management</h2>

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "add" ? "active" : ""}`}
              onClick={() => setActiveTab("add")}
            >
              Add
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "update" ? "active" : ""}`}
              onClick={() => setActiveTab("update")}
            >
              Update
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "delete" ? "active" : ""}`}
              onClick={() => setActiveTab("delete")}
            >
              Delete
            </button>
          </li>
        </ul>

        {activeTab === "add" && (
          <div>
            <h5>Add New Equipment</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  name="category"
                  value={form.category || "OTHER"}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <textarea
                  className="form-control"
                  placeholder="Description"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Total Quantity"
                  name="totalQuantity"
                  value={form.totalQuantity || 0}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Available Quantity"
                  name="availableQuantity"
                  value={form.availableQuantity || 0}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  name="condition"
                  value={form.condition || "GOOD"}
                  onChange={handleChange}
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Image URL (optional)"
                  name="imageUrl"
                  value={form.imageUrl || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <button className="btn btn-success" onClick={handleAdd}>
                  Add Equipment
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "update" && (
          <div>
            <h5>Update Equipment</h5>
            <select
              className="form-select mb-3"
              value={updateId}
              onChange={(e) => handleSelectUpdate(e.target.value)}
            >
              <option value="">Select Equipment</option>
              {equipmentList.map((eq) => (
                <option key={eq.equipmentId} value={eq.equipmentId}>
                  {eq.name}
                </option>
              ))}
            </select>
            {updateId && (
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    name="category"
                    value={form.category || "OTHER"}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <textarea
                    className="form-control"
                    placeholder="Description"
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Total Quantity"
                    name="totalQuantity"
                    value={form.totalQuantity || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Available Quantity"
                    name="availableQuantity"
                    value={form.availableQuantity || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="condition"
                    value={form.condition || "GOOD"}
                    onChange={handleChange}
                  >
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Image URL (optional)"
                    name="imageUrl"
                    value={form.imageUrl || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-warning" onClick={handleUpdate}>
                    Update Equipment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "delete" && (
          <div>
            <h5>Delete Equipment</h5>
            <select
              className="form-select mb-3"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            >
              <option value="">Select Equipment</option>
              {equipmentList.map((eq) => (
                <option key={eq.equipmentId} value={eq.equipmentId}>
                  {eq.name}
                </option>
              ))}
            </select>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Equipment
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default InventoryManagementPage;
