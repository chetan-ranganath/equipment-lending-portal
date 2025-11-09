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
      const data: Equipment[] = await res.json();
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

  const renderForm = (isUpdate = false) => (
    <div className="card p-4 shadow-sm mb-4">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Equipment Name</label>
          <input
            className="form-control"
            placeholder="Name"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category</label>
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
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Description"
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label text-primary">Total Quantity</label>
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
          <label className="form-label text-success">Available Quantity</label>
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
          <label className="form-label">Condition</label>
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
          <label className="form-label">Image URL (optional)</label>
          <input
            className="form-control"
            placeholder="Image URL"
            name="imageUrl"
            value={form.imageUrl || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <button
            className={`btn ${isUpdate ? "btn-warning" : "btn-success"}`}
            onClick={isUpdate ? handleUpdate : handleAdd}
          >
            {isUpdate ? "Update Equipment" : "Add Equipment"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Inventory Management</h2>

        <ul className="nav nav-tabs mb-4 justify-content-center">
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

        {activeTab === "add" && renderForm(false)}

        {activeTab === "update" && (
          <>
            <div className="mb-3">
              <select
                className="form-select"
                value={updateId}
                onChange={(e) => handleSelectUpdate(e.target.value)}
              >
                <option value="">Select Equipment to Update</option>
                {equipmentList.map((eq) => (
                  <option key={eq.equipmentId} value={eq.equipmentId}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>
            {updateId && renderForm(true)}
          </>
        )}

        {activeTab === "delete" && (
          <div className="card p-4 shadow-sm mb-4">
            <div className="mb-3">
              <select
                className="form-select"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
              >
                <option value="">Select Equipment to Delete</option>
                {equipmentList.map((eq) => (
                  <option key={eq.equipmentId} value={eq.equipmentId}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>
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
