import React from 'react';
import { X, Eye, Calculator, ShoppingBag, Check, Star, ShieldCheck, MapPin, Layers } from 'lucide-react';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onTryInRoom,
  onEstimateCost,
  onAddToQuote,
  isQuoted = false
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} id="product-detail-modal">
      <div
        className="modal-card"
        style={{ maxWidth: 840 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge-gold">{product.categoryLabel}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              SKU: {product.sku}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-glass btn-icon"
            onClick={onClose}
            id="close-product-detail-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28, marginBottom: 28 }}>
          {/* Large Image Preview */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#0d121c',
              border: '1px solid var(--border-subtle)',
              height: 380
            }}
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details & Specs */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', marginBottom: 8, fontSize: '0.85rem' }}>
              <Star size={16} fill="#f59e0b" />
              <strong style={{ color: '#fff' }}>{product.rating}</strong>
              <span style={{ color: 'var(--text-muted)' }}>({product.reviews} architectural reviews)</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
              {product.name}
            </h2>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/{product.unit}</span>
              {product.mrp && (
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 10 }}>
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              {product.description}
            </p>

            {/* Specifications Table */}
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: 20,
                fontSize: '0.825rem'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Finish: </span>
                  <strong style={{ color: '#fff' }}>{product.finish}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Dimensions: </span>
                  <strong style={{ color: '#fff' }}>{product.size}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Thickness: </span>
                  <strong style={{ color: '#fff' }}>{product.thickness || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Origin: </span>
                  <strong style={{ color: '#fff' }}>{product.origin || 'Imported'}</strong>
                </div>
                {product.specs?.waterAbsorption && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Water Absorpt: </span>
                    <strong style={{ color: '#fff' }}>{product.specs.waterAbsorption}</strong>
                  </div>
                )}
                {product.specs?.slipResistance && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Slip Rating: </span>
                    <strong style={{ color: '#fff' }}>{product.specs.slipResistance}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Spaces */}
            {product.recommendedRooms && (
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                  Recommended Spaces:
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.recommendedRooms.map((r) => (
                    <span key={r} className="badge-tag" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)' }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div style={{ display: 'flex', gap: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <button
            type="button"
            className="btn btn-gold"
            style={{ flex: 1 }}
            onClick={() => {
              onTryInRoom(product);
              onClose();
            }}
            id="modal-try-in-room-btn"
          >
            <Eye size={16} /> Simulate in 3D Room
          </button>

          <button
            type="button"
            className="btn btn-glass"
            onClick={() => {
              onEstimateCost(product);
              onClose();
            }}
          >
            <Calculator size={16} /> Area Calculator
          </button>

          <button
            type="button"
            className={`btn ${isQuoted ? 'btn-gold' : 'btn-glass'}`}
            onClick={() => onAddToQuote(product)}
          >
            {isQuoted ? (
              <>
                <Check size={16} /> Added to Quote
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add to Quote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
