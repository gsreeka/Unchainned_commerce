import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "../../graphql/queries";
import "./productlist.css";   // simple CSS import

export default function ProductsList({ cartId, onAddToCart }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <div className="loading">Loading NEMA standards...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="products-container">
      <div className="products-wrapper">
        <div className="products-header">PRODUCTS</div>

        <div className="products-grid">
          {data.products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <div className="product-image-box">
                  <div className="nema-tag">NEMA</div>
                  <div className="product-short-title">
                    {product.title.split(" ").slice(0, 3).join(" ")}
                  </div>
                  <div className="doc-label">Standard Document</div>
                </div>
              </div>

              <div className="product-body">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-desc">{product.description}</p>

                <div className="product-price-row">
                  <div>
                    <div className="price-label">PRICED FROM</div>
                    <span className="price">${product.price}</span>
                  </div>

                  <button
                    onClick={() => onAddToCart(product.id)}
                    className="add-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
