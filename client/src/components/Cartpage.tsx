import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./Navbar";
import { useCart } from "./CartContext";
import { useState } from "react";

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [quantities, setQuantities] = useState(
    Object.fromEntries(cart.map((item) => [item.equipmentId, item.quantity]))
  );

  const handleQuantityChange = (id: string, value: number, max: number) => {
    if (value < 1) value = 1;
    if (value > max) value = max;

    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const totalItems = Object.values(quantities).reduce(
    (sum, q) => sum + (Number(q) || 0),
    0
  );

  return (
    <>
      <NavBar />
      <div className="container mt-4 mb-5">
        <h2 className="fw-bold mb-4 text-center">🛒 Your Equipment Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty cart"
              style={{ width: "120px", opacity: 0.7 }}
            />
            <p className="mt-3 fs-5">Your cart is empty.</p>
            <p className="text-secondary">Add some equipment to get started!</p>
          </div>
        ) : (
          <>
            <div className="row">
              {cart.map((item) => (
                <div key={item.equipmentId} className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="card-img-top"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold mb-1">{item.name}</h5>
                      <p className="text-muted small mb-2">{item.category}</p>
                      <p className="text-secondary small mb-2">
                        {item.description}
                      </p>

                      <div className="mt-auto">
                        <label className="form-label fw-semibold">
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ width: "100px" }}
                          value={quantities[item.equipmentId] ?? item.quantity}
                          min={1}
                          max={item.availableQuantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.equipmentId,
                              Number(e.target.value),
                              item.availableQuantity
                            )
                          }
                        />
                        <small className="text-muted">
                          Available: {item.availableQuantity}
                        </small>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item.equipmentId)}
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body text-center">
                <h5 className="fw-bold mb-3">Request Summary</h5>
                <p className="mb-2">
                  Total distinct items: <strong>{cart.length}</strong>
                </p>
                <p className="mb-3">
                  Total quantity requested:{" "}
                  <strong className="text-primary">{totalItems}</strong>
                </p>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button className="btn btn-success px-4">
                    ✅ Submit Request
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartPage;
