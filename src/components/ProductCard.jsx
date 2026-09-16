import React from 'react';
import { Eye, Calculator, Plus, Check, Star, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function ProductCard({
  product,
  onTryInRoom,
  onEstimateCost,
  onAddToQuote,
  isQuoted = false,
  onViewDetails
}) {
  return (
    <div className="product-card" id={`product-${product.id}`}>
      {/* Thumbnail with overlay badges */}
      <div className="product-thumb-wrap" onClick={() => onViewDetails(product)}>
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
        />

        <div className="thumb-badges">
          {product.badge && (
            <span className="badge-gold">
              {product.badge}
            </span>
          )}
          <span className="badge-tag">
            {product.categoryLabel}
          </span>
        </div>

        <div className="thumb-quick-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn btn-gold btn-sm"
            onClick={() => onTryInRoom(product)}
            title="Preview in Room"
          >
            <Eye size={14} /> See in Room
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-content">
        <div className="product-meta-row">
          <span>{product.sku}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
            <Star size={13} fill="#f59e0b" /> {product.rating} ({product.reviews})
          </span>
        </div>

        <h3
          className="product-title"
          onClick={() => onViewDetails(product)}
          style={{ cursor: 'pointer' }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Specifications Chips */}
        <div className="product-specs-chips">
          <span className="badge-tag">{product.finish}</span>
          <span className="badge-tag">{product.size}</span>
          {product.thickness && <span className="badge-tag">{product.thickness}</span>}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>

        {/* Pricing / Rate Section */}
        <div className="product-rate-row">
          <div>
            <span className="price-current">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="price-unit">/{product.unit}</span>
            {product.mrp && (
              <span className="price-mrp">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            className="btn-glass btn-sm"
            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
            onClick={() => onEstimateCost(product)}
            title="Calculate area and boxes needed"
          >
            <Calculator size={13} /> Calculate
          </button>
        </div>

        {/* Card Action Bar */}
        <div className="card-action-bar">
          <button
            type="button"
            className="btn btn-try-room btn-sm"
            onClick={() => onTryInRoom(product)}
            id={`btn-try-${product.id}`}
          >
            <Eye size={15} /> Try in Room
          </button>

          <button
            type="button"
            className={`btn btn-sm ${isQuoted ? 'btn-gold' : 'btn-glass'}`}
            onClick={() => onAddToQuote(product)}
            id={`btn-quote-${product.id}`}
          >
            {isQuoted ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <Plus size={14} /> Quote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
