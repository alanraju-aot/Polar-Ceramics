import React from 'react';
import { Eye, Upload, Sparkles, ArrowRight, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenVisualizer, onOpenCustomUpload }) {
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left: Brand Value & CTAs */}
          <div>
            <div className="hero-badge-wrap">
              <span className="badge-gold">
                <Sparkles size={14} /> Ultra-Luxury Surfaces & Sanitary Studio
              </span>
            </div>

            <h1 className="hero-title">
              Curated Tiles, Exotic Granites & <span className="text-gold-gradient">Italian Marbles.</span>
            </h1>

            <p className="hero-description">
              Elevate your home, villa, or architectural project with handpicked natural stones, large-format porcelain slabs, and designer sanitary wares. Experience our proprietary <strong>3D Room & Hall Visualizer</strong>: preview any design in sample halls or upload your own room photo!
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => onOpenVisualizer()}
                id="hero-launch-visualizer-btn"
              >
                <Eye size={18} />
                <span>Launch Room Visualizer</span>
              </button>

              <button
                type="button"
                className="btn btn-glass"
                onClick={() => onOpenCustomUpload()}
                id="hero-upload-photo-btn"
              >
                <Upload size={18} />
                <span>Upload Your Room Photo</span>
              </button>
            </div>

            {/* Value Metrics */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">450+</div>
                <div className="stat-label">Luxury Slabs & Designs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Italian & Natural Origin</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12,000+</div>
                <div className="stat-label">Homes Transformed</div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Visualizer Feature Preview Card */}
          <div>
            <div className="hero-visual-card">
              <div className="hero-image-wrap">
                <img
                  src="/rooms/living-hall.jpg"
                  alt="Polar Ceramics Grand Living Hall Preview"
                  loading="eager"
                />
                <div className="hero-visual-overlay">
                  <div className="visualizer-quick-launch">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          background: 'url(/textures/statuario-white.jpg) center/cover',
                          border: '2px solid var(--gold-primary)'
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                          Grand Living Hall Simulator
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                          Active: Italian Statuario Royale Floor
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-gold btn-sm"
                      onClick={() => onOpenVisualizer()}
                    >
                      <Eye size={14} /> Try Live
                    </button>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '16px 20px',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={16} color="#D4AF37" /> Instant Perspective Quad Warping
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} color="#10B981" /> Preserves Room Lighting & Shadows
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
