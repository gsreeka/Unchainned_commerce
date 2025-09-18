import React from 'react';

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      overflow: 'hidden',
      height: '380px',
      display: 'flex',
      flexDirection: 'column',
      width: '280px'
    }}
    onClick={() => {
      console.log('Product clicked:', product);
      onProductClick && onProductClick(product);
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      e.currentTarget.style.borderColor = '#2E5BBA';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.borderColor = '#e5e7eb';
    }}
    >
      {/* Document Preview Area */}
      <div style={{
        height: '220px',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {/* Document representation */}
        <div style={{
          width: '160px',
          height: '200px',
          background: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* NEMA Logo area */}
          <div style={{
            height: '40px',
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            color: '#2E5BBA'
          }}>
            NEMA
          </div>
          
          {/* Content lines */}
          <div style={{
            padding: '0.75rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{
              height: '3px',
              background: '#e5e7eb',
              borderRadius: '2px',
              width: '80%'
            }} />
            <div style={{
              height: '3px',
              background: '#e5e7eb',
              borderRadius: '2px',
              width: '90%'
            }} />
            <div style={{
              height: '3px',
              background: '#e5e7eb',
              borderRadius: '2px',
              width: '70%'
            }} />
            <div style={{
              height: '3px',
              background: '#e5e7eb',
              borderRadius: '2px',
              width: '85%'
            }} />
            <div style={{
              height: '3px',
              background: '#e5e7eb',
              borderRadius: '2px',
              width: '60%'
            }} />
          </div>
          
          {/* Corner fold */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderLeft: '12px solid #f3f4f6',
            borderTop: '12px solid #d1d5db'
          }} />
        </div>
        
        {/* Colored accent based on product type */}
        {product.title.includes('TS') && (
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            width: '40px',
            height: '160px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            borderRadius: '4px',
            opacity: 0.8
          }} />
        )}
      </div>

      {/* Product Info */}
      <div style={{
        padding: '1rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: '600',
          color: '#2E5BBA',
          margin: '0 0 0.5rem 0',
          lineHeight: '1.3',
          minHeight: '2.6rem'
        }}>
          {product.title}
        </h3>
        
        <div style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#dc2626',
          marginTop: 'auto'
        }}>
          PRICED FROM ${product.access && product.access.length > 0 
            ? Math.min(...product.access.map(a => a.price_usd)).toFixed(2)
            : (product.price || 0).toFixed(2)}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div style={{
        padding: '0 1rem 1rem 1rem'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product.id);
          }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #2E5BBA 0%, #1e3f7a 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(46, 91, 186, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
