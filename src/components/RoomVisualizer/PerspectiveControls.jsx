import React from 'react';
import { Move, Grid, RotateCcw, Lock, CheckCircle, HelpCircle } from 'lucide-react';

export default function PerspectiveControls({
  isEditingPins,
  onToggleEditPins,
  showGrid,
  onToggleShowGrid,
  onResetPoints,
  activeSurface,
  onChangeSurface,
  availableSurfaces = ['floor']
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Surface Selector (Floor / Wall) */}
      {availableSurfaces.length > 1 && (
        <div>
          <div className="sidebar-heading">Apply Surface</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              className={`btn-sm ${activeSurface === 'floor' ? 'btn-gold' : 'btn-glass'}`}
              onClick={() => onChangeSurface('floor')}
            >
              Floor Area
            </button>
            <button
              type="button"
              className={`btn-sm ${activeSurface === 'wall' ? 'btn-gold' : 'btn-glass'}`}
              onClick={() => onChangeSurface('wall')}
            >
              Wall / Accent
            </button>
          </div>
        </div>
      )}

      {/* Pin Controls */}
      <div>
        <div className="sidebar-heading">Perspective Alignment</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            className={`btn btn-sm ${isEditingPins ? 'btn-gold' : 'btn-glass'}`}
            onClick={onToggleEditPins}
            id="toggle-edit-pins-btn"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isEditingPins ? (
              <>
                <Lock size={15} /> Lock Perspective Alignment
              </>
            ) : (
              <>
                <Move size={15} /> Drag 6 Floor Endpoints (3 Top + 3 Bottom)
              </>
            )}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              className={`btn-glass btn-sm ${showGrid ? 'active' : ''}`}
              onClick={onToggleShowGrid}
              id="toggle-perspective-grid-btn"
              style={{
                borderColor: showGrid ? 'var(--gold-primary)' : 'var(--border-subtle)',
                color: showGrid ? 'var(--gold-light)' : 'inherit'
              }}
            >
              <Grid size={14} /> Guide Grid
            </button>

            <button
              type="button"
              className="btn-glass btn-sm"
              onClick={onResetPoints}
              id="reset-points-btn"
            >
              <RotateCcw size={14} /> Reset Pins
            </button>
          </div>
        </div>
      </div>

      {isEditingPins && (
        <div
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            fontSize: '0.78rem',
            color: 'var(--gold-light)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8
          }}
        >
          <HelpCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            <strong>6-Endpoint Precision Active:</strong> Drag <strong>P1, P2, P3</strong> along the top and <strong>P4, P5, P6</strong> along the bottom to fit around sofas, walls, and angled floor lines.
          </span>
        </div>
      )}
    </div>
  );
}
