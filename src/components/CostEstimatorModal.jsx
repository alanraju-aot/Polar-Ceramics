import React, { useState, useMemo } from 'react';
import { X, Calculator, ShoppingBag, CheckCircle, Info, Sparkles } from 'lucide-react';
import { calculateTileEstimate } from '../utils/formatters';

export default function CostEstimatorModal({
  isOpen,
  onClose,
  product,
  allProducts,
  onAddToQuote
}) {
  const [selectedProduct, setSelectedProduct] = useState(product || allProducts[0]);
  const [lengthFt, setLengthFt] = useState('16');
  const [widthFt, setWidthFt] = useState('14');
  const [unit, setUnit] = useState('feet'); // 'feet' or 'meters'
  const [wastagePercent, setWastagePercent] = useState(10);

  // Sync when product prop changes
  React.useEffect(() => {
    if (product) setSelectedProduct(product);
  }, [product]);

  // Convert dimensions if in meters
  const effectiveLengthFt = unit === 'meters' ? (parseFloat(lengthFt) || 0) * 3.28084 : (parseFloat(lengthFt) || 0);
  const effectiveWidthFt = unit === 'meters' ? (parseFloat(widthFt) || 0) * 3.28084 : (parseFloat(widthFt) || 0);

  const coveragePerBox = 15.5; // Average coverage in sq.ft per box
  const pricePerSqFt = selectedProduct?.unit === 'sq.ft' ? selectedProduct.price : 180;

  const estimate = useMemo(() => {
    return calculateTileEstimate(
      effectiveLengthFt,
      effectiveWidthFt,
      pricePerSqFt,
      coveragePerBox,
      wastagePercent
    );
  }, [effectiveLengthFt, effectiveWidthFt, pricePerSqFt, coveragePerBox, wastagePercent]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} id="cost-estimator-modal">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge-gold">
              <Calculator size={15} /> Estimator Studio
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
              Area & Material Rate Calculator
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-glass btn-icon"
            onClick={onClose}
            id="close-estimator-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Selected Material / Design:
          </label>
          <select
            className="select-custom"
            style={{ width: '100%', padding: '10px 16px' }}
            value={selectedProduct?.id}
            onChange={(e) => {
              const found = allProducts.find((p) => p.id === e.target.value);
              if (found) setSelectedProduct(found);
            }}
            id="estimator-product-select"
          >
            {allProducts.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#121824', color: '#fff' }}>
                {p.name} ({p.categoryLabel}) — ₹{p.price}/{p.unit}
              </option>
            ))}
          </select>
        </div>

        {/* Dimension Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Room Length ({unit === 'feet' ? 'Feet' : 'Meters'})
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={lengthFt}
              onChange={(e) => setLengthFt(e.target.value)}
              className="search-input"
              style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px'
              }}
              id="input-room-length"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Room Width ({unit === 'feet' ? 'Feet' : 'Meters'})
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={widthFt}
              onChange={(e) => setWidthFt(e.target.value)}
              className="search-input"
              style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px'
              }}
              id="input-room-width"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Measurement Unit
            </label>
            <select
              className="select-custom"
              style={{ width: '100%', padding: '10px 14px' }}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="feet" style={{ background: '#121824', color: '#fff' }}>Feet (ft)</option>
              <option value="meters" style={{ background: '#121824', color: '#fff' }}>Meters (m)</option>
            </select>
          </div>
        </div>

        {/* Wastage buffer */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
            <span>Recommended Cutting & Corner Wastage Allowance:</span>
            <span style={{ fontWeight: 700, color: 'var(--gold-light)' }}>{wastagePercent}%</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[5, 10, 15].map((pct) => (
              <button
                key={pct}
                type="button"
                className={`btn-sm ${wastagePercent === pct ? 'btn-gold' : 'btn-glass'}`}
                onClick={() => setWastagePercent(pct)}
                style={{ flex: 1, fontSize: '0.8rem' }}
              >
                +{pct}% (Standard)
              </button>
            ))}
          </div>
        </div>

        {/* Estimate Breakdown Card */}
        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: 24
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Room Area</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {estimate.baseArea} <span style={{ fontSize: '0.8rem' }}>sq.ft</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total with Wastage</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                {estimate.totalAreaWithWastage} <span style={{ fontSize: '0.8rem' }}>sq.ft</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Packing Boxes Needed</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>
                {estimate.boxesNeeded} <span style={{ fontSize: '0.8rem' }}>Boxes</span>
              </div>
            </div>
          </div>

          {/* Cost Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Material Cost ({selectedProduct?.name}):</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>₹{estimate.totalMaterialCost.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Polymer Adhesive & Epoxy Grout (~₹18/sq.ft):</span>
              <span>₹{estimate.estimatedAdhesiveGroutCost.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Certified Installation Labor (~₹32/sq.ft):</span>
              <span>₹{estimate.estimatedLaborCost.toLocaleString('en-IN')}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--gold-light)',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 10,
                marginTop: 6
              }}
            >
              <span>Estimated Complete Project Budget:</span>
              <span>₹{estimate.estimatedTotalProjectCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            className="btn btn-gold"
            style={{ flex: 1 }}
            onClick={() => {
              onAddToQuote(selectedProduct, estimate);
              onClose();
            }}
            id="btn-add-estimate-to-quote"
          >
            <ShoppingBag size={16} /> Add Estimate to Project Quote
          </button>

          <button
            type="button"
            className="btn btn-glass"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
