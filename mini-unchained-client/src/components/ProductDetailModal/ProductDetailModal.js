import React from 'react';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          background: '#2E5BBA',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '8px 8px 0 0',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* NEMA Logo Box */}
            <div style={{
              background: 'white',
              color: '#2E5BBA',
              padding: '0.5rem 1rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              letterSpacing: '1px'
            }}>
              NEMA
            </div>
            
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
                {product.doc_number || product.title}
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                NEMA Standard Document
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* Document Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#2E5BBA', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem'
            }}>
              Document Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Document Number</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{product.doc_number || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Short Title</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{product.short_title || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Series</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{product.series || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Part</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{product.part || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Revision</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{product.revision || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Status</label>
                <span style={{ 
                  margin: '0.25rem 0 0 0', 
                  color: product.status === 'active' ? '#059669' : '#dc2626',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {product.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#2E5BBA', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem'
            }}>
              Title & Description
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Full Title</label>
              <p style={{ margin: '0.5rem 0 0 0', color: '#111827', lineHeight: '1.5' }}>{product.title}</p>
            </div>
            
            <div>
              <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Description</label>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', lineHeight: '1.6' }}>
                {product.description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Publication Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#2E5BBA', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem'
            }}>
              Publication Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Publisher</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                  {product.publisher || 'N/A'}
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Publication Year</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{product.publication_year || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Languages</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
                  {product.languages?.join(', ') || 'English'}
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Multi-User License</label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
                  {product.multi_user ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Access Options & Pricing */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#2E5BBA', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem'
            }}>
              Access Options & Pricing
            </h3>
            
            {product.access && product.access.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {product.access.map((option, index) => (
                  <div key={index} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '1rem',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                          {option.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                          SKU: {option.sku}
                        </p>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#dc2626' }}>
                        ${option.price_usd?.toFixed(2) || product.price?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '1rem',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                      Standard Access
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                      Digital and print access
                    </p>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#dc2626' }}>
                    ${product.price?.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#2E5BBA', 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                Tags
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.tags.map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {product.metadata && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#2E5BBA', 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                Document Metadata
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Document Type</label>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
                    {product.metadata.document_type || 'Standard'}
                  </p>
                </div>
                <div>
                  <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Format Support</label>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
                    {product.metadata.format_support?.join(', ') || 'PDF, Print'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={onClose}
              style={{
                background: '#2E5BBA',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
