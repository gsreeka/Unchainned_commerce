import "./orderconfirmation.css"; // plain import (not styles.module.css)

export default function OrderConfirmation({ order, onContinueShopping }) {
  return (
    <div className="order-confirmation">
      <div className="order-header">
        ✅ ORDER CONFIRMED
      </div>

      <div className="order-body">
        <div className="order-message">
          <h3>Thank you for your order!</h3>
          <p>Your NEMA standards have been processed successfully.</p>
        </div>

        <div className="order-details">
          <div><strong>Order ID:</strong> {order.id}</div>
          <div><strong>Total:</strong> ${order.total.toFixed(2)}</div>
          <div><strong>Status:</strong> {order.status}</div>
          <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
        </div>

        <button
          onClick={onContinueShopping}
          className="order-button"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
