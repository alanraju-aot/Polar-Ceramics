import React from 'react';
import { RotateCw, Maximize2, Sliders, Palette, Sun, Layers } from 'lucide-react';

const GROUT_COLORS = [
  { name: 'Pure White', color: '#FFFFFF' },
  { name: 'Platinum Grey', color: '#CBD5E1' },
  { name: 'Charcoal Slate', color: '#334155' },
  { name: 'Champagne Gold', color: '#D4AF37' },
  { name: 'Warm Cream', color: '#F5EEDB' }
];

export default function TileCustomizer({ options, onChange }) {
  const {
    tileScale = 1.0,
    rotation = 0,
    groutWidth = 2,
    groutColor = '#CBD5E1',
    blendMode = 'multiply',
    opacity = 0.85
  } = options;

  const update = (key, value) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tile Scale */}
      <div className="control-row">
        <div className="control-label-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Maximize2 size={15} color="var(--gold-primary)" /> Tile / Slab Scale
          </span>
          <span style={{ fontWeight: 600, color: '#fff' }}>{Math.round(tileScale * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.35"
          max="2.2"
          step="0.05"
          value={tileScale}
          onChange={(e) => update('tileScale', parseFloat(e.target.value))}
          className="custom-range"
          id="customizer-scale-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>Compact Mosaic (300mm)</span>
          <span>Standard (600x1200)</span>
          <span>Jumbo Slab (1600+)</span>
        </div>
      </div>

      {/* Rotation / Pattern Layout */}
      <div className="control-row">
        <div className="control-label-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCw size={15} color="var(--gold-primary)" /> Tile Orientation
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: '0° Grid', value: 0 },
            { label: '45° Diamond', value: 45 },
            { label: '90° Vertical', value: 90 }
          ].map((rot) => (
            <button
              key={rot.value}
              type="button"
              className={`btn-sm ${rotation === rot.value ? 'btn-gold' : 'btn-glass'}`}
              onClick={() => update('rotation', rot.value)}
              style={{ fontSize: '0.8rem', padding: '6px 8px' }}
              id={`rot-btn-${rot.value}`}
            >
              {rot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grout Line Width */}
      <div className="control-row">
        <div className="control-label-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sliders size={15} color="var(--gold-primary)" /> Grout Line Spacing
          </span>
          <span style={{ fontWeight: 600, color: '#fff' }}>
            {groutWidth === 0 ? 'Seamless Slab' : `${groutWidth} mm`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={groutWidth}
          onChange={(e) => update('groutWidth', parseInt(e.target.value, 10))}
          className="custom-range"
          id="customizer-grout-width-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>0mm (Seamless)</span>
          <span>2mm (Standard)</span>
          <span>5mm (Rustic)</span>
        </div>
      </div>

      {/* Grout Color Swatches */}
      {groutWidth > 0 && (
        <div className="control-row">
          <div className="control-label-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Palette size={15} color="var(--gold-primary)" /> Grout Line Tone
            </span>
          </div>
          <div className="color-swatches-grid">
            {GROUT_COLORS.map((g) => (
              <button
                key={g.color}
                type="button"
                className={`grout-swatch ${groutColor === g.color ? 'active' : ''}`}
                style={{ backgroundColor: g.color }}
                onClick={() => update('groutColor', g.color)}
                title={g.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lighting & Blend Mode */}
      <div className="control-row">
        <div className="control-label-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sun size={15} color="var(--gold-primary)" /> Shadow & Light Blending
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Multiply (Natural)', value: 'multiply' },
            { label: 'Overlay (Glow)', value: 'overlay' },
            { label: 'Normal (Direct)', value: 'normal' }
          ].map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={`btn-sm ${blendMode === mode.value ? 'btn-gold' : 'btn-glass'}`}
              onClick={() => update('blendMode', mode.value)}
              style={{ fontSize: '0.75rem', padding: '6px 4px' }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity / Intensity */}
      <div className="control-row">
        <div className="control-label-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={15} color="var(--gold-primary)" /> Surface Opacity
          </span>
          <span style={{ fontWeight: 600, color: '#fff' }}>{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.4"
          max="1.0"
          step="0.05"
          value={opacity}
          onChange={(e) => update('opacity', parseFloat(e.target.value))}
          className="custom-range"
        />
      </div>
    </div>
  );
}
