import React from 'react';
import { Award, Compass, ShieldCheck, Sparkles, CheckCircle2, Factory } from 'lucide-react';

export default function BrandStory() {
  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-darkest)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}>
          <span className="badge-gold" style={{ marginBottom: 12 }}>
            Master Craftsmanship
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', color: '#fff', marginBottom: 16 }}>
            Why Architects & Designers Choose <span className="text-gold-gradient">Polar</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            We bridge the gap between global quarries and bespoke architectural visions, backed by our proprietary digital room visualizer.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 60 }}>
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: 'var(--gold-light)' }}>
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: 10 }}>Direct Italian Quarries</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Directly quarried from the mountains of Carrara, Tuscany, and Verona. Every marble block is hand-inspected for pristine vein symmetry and density.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#38bdf8' }}>
              <Factory size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: 10 }}>CNC Waterjet Precision</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Ultra-high-pressure robotic waterjet cutting to within 0.1mm tolerance. Perfect bookmatching, chamfering, and customized mosaic inlays.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#10b981' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: 10 }}>Zero Porosity Seal</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All natural granites and vitrified tiles undergo nano-polymer surface sealing, guaranteeing total protection against wine, oil, and acid etching.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#f43f5e' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: 10 }}>3D Real-Time Simulation</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              No more guessing how a tile looks when laid down. Our perspective warping engine shows the finished floor in your exact room before you purchase!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
