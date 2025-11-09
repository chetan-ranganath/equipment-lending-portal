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
    SPORTS: "https://cdn-icons-png.flaticon.com/512/833/833314.png",
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
      className="card shadow-sm border-0 h-100 rounded-4 overflow-hidden"
      style={{
        transition: "transform 0.2s ease",
        backgroundColor: isAvailable ? "white" : "#f8f9fa",
      }}
    >
      <img
        src={getImageUrl()}
        className="card-img-top"
        alt={equipment.name}

        onError={(e) => {
          const category = equipment.category?.toUpperCase() || "OTHER";
          (e.target as HTMLImageElement).src =
            defaultImages[category] || defaultImages["OTHER"];
        }}
        style={{
          height: "200px",
          objectFit: "cover",
          borderBottom: "1px solid #eee",
          backgroundColor: "#f8f9fa",
        }}
      />

      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h5 className="card-title fw-bold mb-1">{equipment.name}</h5>
          <p className="text-muted mb-1">{equipment.category}</p>
          <p className="small text-secondary mb-3">
            {equipment.description.length > 80
              ? equipment.description.slice(0, 80) + "..."
              : equipment.description}
          </p>
        </div>

        <div className="text-center">
          {/* Quantity selector */}
          <div className="d-flex justify-content-center align-items-center mb-2">
            <button
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
              onClick={decrement}
              disabled={quantity <= 1 || !isAvailable}
            >
              –
            </button>

            <span
              className="fw-bold fs-5 mx-3"
              style={{
                minWidth: "40px",
                textAlign: "center",
                color: "#222",
                lineHeight: "1",
              }}
            >
              {quantity}
            </span>

            <button
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
              onClick={increment}
              disabled={quantity >= equipment.availableQuantity || !isAvailable}
            >
              +
            </button>
          </div>

          {/* Availability info */}
          <small
            className="text-muted d-block mb-3"
            style={{ fontSize: "0.85rem" }}
          >
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
