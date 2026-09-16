import React from 'react';
import { Sparkles, Eye, Calculator, ShoppingBag, Compass, Layers, Phone } from 'lucide-react';

export default function Navbar({
  onOpenVisualizer,
  onOpenEstimator,
  onOpenQuoteDrawer,
  quoteCount = 0,
  activeCategory,
  onSelectCategory
}) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Identity */}
        <a href="#hero" className="brand-logo">
          <div className="brand-icon">
            <img src="/logo.svg" alt="Polar Ceramics Logo" style={{ width: 26, height: 26, objectFit: 'contain' }} />
          </div>
          <div>
            <div className="brand-title">POLAR</div>
            <div className="brand-subtitle">Ceramics & Surfaces</div>
          </div>
        </a>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <a
                href="#catalog"
                className={`nav-link ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => onSelectCategory('all')}
              >
                All Collections
              </a>
            </li>
            <li>
              <a
                href="#catalog"
                className={`nav-link ${activeCategory === 'tiles' ? 'active' : ''}`}
                onClick={() => onSelectCategory('tiles')}
              >
                Tiles
              </a>
            </li>
            <li>
              <a
                href="#catalog"
                className={`nav-link ${activeCategory === 'marbles' ? 'active' : ''}`}
                onClick={() => onSelectCategory('marbles')}
              >
                Italian Marbles
              </a>
            </li>
            <li>
              <a
                href="#catalog"
                className={`nav-link ${activeCategory === 'granites' ? 'active' : ''}`}
                onClick={() => onSelectCategory('granites')}
              >
                Granites
              </a>
            </li>
            <li>
              <a
                href="#catalog"
                className={`nav-link ${activeCategory === 'sanitary' ? 'active' : ''}`}
                onClick={() => onSelectCategory('sanitary')}
              >
                Sanitary Wares
              </a>
            </li>
            <li>
              <button
                type="button"
                className="nav-link"
                style={{ background: 'none', border: 'none', font: 'inherit' }}
                onClick={() => onOpenEstimator()}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Calculator size={15} /> Rate Calculator
                </span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-gold btn-sm"
            onClick={() => onOpenVisualizer()}
            id="nav-visualizer-btn"
          >
            <Eye size={16} />
            <span>See in Room</span>
          </button>

          <button
            type="button"
            className="btn btn-glass btn-icon"
            onClick={onOpenQuoteDrawer}
            title="Quotation / Wishlist"
            id="nav-quote-btn"
            style={{ position: 'relative' }}
          >
            <ShoppingBag size={18} />
            {quoteCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--gold-primary)',
                  color: '#000',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(212,175,55,0.8)'
                }}
              >
                {quoteCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
