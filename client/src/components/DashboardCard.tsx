import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { useCart } from "./CartContext";

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

interface DashboardCardProps {
  equipment: Equipment;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ equipment }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const isAvailable = equipment.available && equipment.availableQuantity > 0;

  const defaultImages: Record<string, string> = {
    SPORTS: "https://cdn-icons-png.flaticon.com/128/3915/3915004.png",
    LAB: "https://cdn-icons-png.flaticon.com/512/3063/3063490.png",
    MUSIC: "https://cdn-icons-png.flaticon.com/512/727/727218.png",
    CAMERA: "https://cdn-icons-png.flaticon.com/512/2920/2920264.png",
    ELECTRONICS: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
    OTHER: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
  };

  const getImageUrl = () => {
    if (equipment.imageUrl && equipment.imageUrl.trim() !== "") {
      return equipment.imageUrl;
    }
    const category = equipment.category?.toUpperCase() || "OTHER";
    return defaultImages[category] || defaultImages["OTHER"];
  };

  const handleAdd = () => {
    if (quantity > 0 && quantity <= equipment.availableQuantity) {
      for (let i = 0; i < quantity; i++) {
        addToCart(equipment);
      }
    } else {
      alert(
        `Invalid quantity. Must be between 1 and ${equipment.availableQuantity}`
      );
    }
  };

  const increment = () => {
    if (quantity < equipment.availableQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div
      className={`card shadow-sm rounded-4 overflow-hidden d-flex flex-row align-items-stretch mb-3`}
      style={{
        minHeight: "180px",
        maxWidth: "550px",
        margin: "auto",
        backgroundColor: isAvailable ? "white" : "#f8f9fa",
        transition: "transform 0.2s ease",
      }}
    >
      {/* Left Image */}
      <div
        className="flex-shrink-0"
        style={{
          width: "30%",
          minWidth: "120px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={getImageUrl()}
          alt={equipment.name}
          onError={(e) => {
            const category = equipment.category?.toUpperCase() || "OTHER";
            (e.target as HTMLImageElement).src =
              defaultImages[category] || defaultImages["OTHER"];
          }}
          style={{
            width: "100%",
            maxHeight: "100%",
            objectFit: "contain", // makes the image shrink without stretching
            borderRadius: "0.5rem 0 0 0.5rem",
            backgroundColor: "#f0f0f0",
          }}
        />
      </div>

      {/* Right Info */}
      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h5 className="fw-bold mb-1">{equipment.name}</h5>
          <p className="text-muted mb-1">{equipment.category}</p>
          <p className="small text-secondary mb-2">
            {equipment.description.length > 80
              ? equipment.description.slice(0, 80) + "..."
              : equipment.description}
          </p>

          <div className="mb-2">
            <small className="text-muted me-3">
              Total: {equipment.totalQuantity}
            </small>
            <small className="text-success">
              Available: {equipment.availableQuantity}
            </small>
          </div>
        </div>

        {/* Quantity + Add Button */}
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <button
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={decrement}
              disabled={quantity <= 1 || !isAvailable}
            >
              –
            </button>
            <span
              className="fw-bold fs-5 mx-2"
              style={{ minWidth: "35px", textAlign: "center" }}
            >
              {quantity}
            </span>
            <button
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={increment}
              disabled={quantity >= equipment.availableQuantity || !isAvailable}
            >
              +
            </button>
          </div>

          <small className="text-muted mb-2">
            {isAvailable
              ? `${equipment.availableQuantity} available`
              : "Currently unavailable"}
          </small>

          <button
            className="btn btn-primary w-100 fw-semibold"
            disabled={!isAvailable}
            onClick={handleAdd}
          >
            {isAvailable ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
