import React from "react";
import { GET_CART } from "../../graphql/queries";
import { useQuery } from "@apollo/client/react";
import "./cart.css";   // plain CSS import

export default function Cart({ cartId, onCheckout, onRemoveItem, onUpdateQuantity, onClearCart }) {
  const { loading, error, data } = useQuery(GET_CART, {
    variables: { id: cartId },
    skip: !cartId
  });

  if (!cartId) {
    return (
      <div className="cart-container">
        <div className="cart-header">SHOPPING CART</div>
        <div className="cart-empty">
          <p>Your cart is empty. Add some NEMA standards to get started!</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="cart-loading">Loading cart...</div>;
  if (error) return <div className="cart-error">Error: {error.message}</div>;

  const cart = data.cart;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <span>SHOPPING CART ({cart.items.length} items)</span>
        {cart.items.length > 0 && (
          <button onClick={() => onClearCart(cartId)} className="clear-btn" title="Clear all items">
            Clear All
          </button>
        )}
      </div>

      <div className="cart-body">
        {cart.items.length === 0 ? (
          <p className="cart-empty">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.product.title}</div>
                    <div className="cart-item-price">${item.product.price} each</div>

                    <div className="cart-item-actions">
                      <button
                        onClick={() => onUpdateQuantity(cartId, item.product.id, item.quantity - 1)}
                        className="qty-btn"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 1;
                          onUpdateQuantity(cartId, item.product.id, newQty);
                        }}
                        min="1"
                        className="qty-input"
                      />

                      <button
                        onClick={() => onUpdateQuantity(cartId, item.product.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>

                      <button
                        onClick={() => onRemoveItem(cartId, item.product.id)}
                        className="remove-btn"
                        title="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">Total: ${cart.total.toFixed(2)}</div>
              <button onClick={() => onCheckout(cartId)} className="checkout-btn">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
