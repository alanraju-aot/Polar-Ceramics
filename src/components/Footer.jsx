import React from 'react';
import { Sparkles, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function Footer({ onOpenVisualizer }) {
  return (
    <footer style={{ background: '#05070a', borderTop: '1px solid var(--border-subtle)', padding: '70px 0 30px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 50 }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="brand-icon" style={{ width: 36, height: 36 }}>
                <img src="/logo.svg" alt="Polar Ceramics Logo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              </div>
              <div className="brand-title" style={{ fontSize: '1.25rem' }}>POLAR</div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              Premier gallery for Italian marbles, granites, large-format glazed vitrified tiles, and smart designer sanitary wares.
            </p>
            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={onOpenVisualizer}
            >
              Launch Room Visualizer
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Surfaces & Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
              <li><a href="#catalog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Italian Carrara & Statuario</a></li>
              <li><a href="#catalog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Black Galaxy Granite</a></li>
              <li><a href="#catalog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Moroccan & Heritage Tiles</a></li>
              <li><a href="#catalog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Chevron Oak Wood Porcelain</a></li>
              <li><a href="#catalog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Smart Wall-Hung Closets & Tubs</a></li>
            </ul>
          </div>

          {/* Showroom Locations */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Flagship Showrooms
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <MapPin size={18} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#fff' }}>Polar Experience Center:</strong><br />
                  Plot 42, Marble & Stone Boulevard, Industrial Avenue, Kochi / Bengaluru / Mumbai
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Clock size={18} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
                <div>
                  Mon - Sat: 9:30 AM - 8:30 PM<br />
                  Sunday: 10:30 AM - 6:00 PM
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Direct Inquiry
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Phone size={16} color="var(--gold-primary)" />
                <a href="tel:+919876543210" style={{ color: '#fff', textDecoration: 'none' }}>+91 98765 43210</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={16} color="var(--gold-primary)" />
                <a href="mailto:info@polarceramics.com" style={{ color: '#fff', textDecoration: 'none' }}>info@polarceramics.com</a>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                Architects & Contractors: Contact our commercial desk for CAD files, BIM models, and trade discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div>
            © {new Date().getFullYear()} Polar Ceramics & Surfaces Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Privacy Policy</span>
            <span>Terms of Supply</span>
            <span>Architectural Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
