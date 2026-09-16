import React from 'react';
import {
  Trash2,
  Move,
  RotateCw,
  FlipHorizontal,
  ArrowUpDown,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Compass,
  Sliders
} from 'lucide-react';

export default function SanitaryOverlay({
  sanitaryItems,
  activeFixtures,
  selectedFixtureId,
  onSelectFixture,
  onAddFixture,
  onRemoveFixture,
  onUpdateFixture
}) {
  const selectedFixture = activeFixtures.find((f) => f.id === selectedFixtureId) || activeFixtures[0];

  // Nudge Helpers
  const nudge = (dx, dy) => {
    if (!selectedFixture) return;
    const currentX = selectedFixture.x || 0.35;
    const currentY = selectedFixture.y || 0.55;
    onUpdateFixture(selectedFixture.id, {
      x: Math.max(-0.25, Math.min(1.05, Math.round((currentX + dx) * 1000) / 1000)),
      y: Math.max(-0.25, Math.min(1.05, Math.round((currentY + dy) * 1000) / 1000))
    });
  };

  // Quick Room Fit Presets
  const applyFitPreset = (preset) => {
    if (!selectedFixture) return;
    if (preset === 'left-wall') {
      onUpdateFixture(selectedFixture.id, {
        x: 0.10,
        y: 0.54,
        rotation: 14,
        skewX: -14,
        flipX: false,
        scaleX: 0.88,
        scaleY: 0.86
      });
    } else if (preset === 'right-wall') {
      onUpdateFixture(selectedFixture.id, {
        x: 0.66,
        y: 0.54,
        rotation: -14,
        skewX: 14,
        flipX: true,
        scaleX: 0.88,
        scaleY: 0.86
      });
    } else if (preset === 'center-floor') {
      onUpdateFixture(selectedFixture.id, {
        x: 0.36,
        y: 0.68,
        rotation: 0,
        skewX: 0,
        flipX: false,
        scaleX: 1.0,
        scaleY: 0.92
      });
    } else if (preset === 'back-wall') {
      onUpdateFixture(selectedFixture.id, {
        x: 0.42,
        y: 0.46,
        rotation: 0,
        skewX: 0,
        flipX: false,
        scaleX: 0.80,
        scaleY: 0.80
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Add Sanitary Wares Grid */}
      <div>
        <div className="sidebar-heading">Select Sanitary Fixtures</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {sanitaryItems.map((item) => {
            const isPlaced = activeFixtures.some((f) => f.productId === item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: `1px solid ${isPlaced ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 10,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => {
                  if (isPlaced) {
                    const existing = activeFixtures.find((f) => f.productId === item.id);
                    if (existing) onRemoveFixture(existing.id);
                  } else {
                    onAddFixture(item);
                  }
                }}
                id={`sanitary-card-${item.id}`}
              >
                <div style={{ width: '100%', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name.replace('Polar ', '')}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--gold-light)', marginBottom: 6 }}>
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
                <button
                  type="button"
                  className={`btn-sm ${isPlaced ? 'btn-gold' : 'btn-glass'}`}
                  style={{ width: '100%', padding: '4px 6px', fontSize: '0.7rem' }}
                >
                  {isPlaced ? '✓ In Room' : '+ Add to Room'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Comprehensive Adjustment Panel for Selected Fixture */}
      {selectedFixture ? (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="sidebar-heading" style={{ margin: 0, color: 'var(--gold-light)' }}>
              Adjusting: {selectedFixture.name.replace('Polar ', '')}
            </span>
            <button
              type="button"
              onClick={() => onRemoveFixture(selectedFixture.id)}
              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}
              title="Remove fixture"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>

          {/* Fixture Selector Pills if multiple placed */}
          {activeFixtures.length > 1 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {activeFixtures.map((fix) => (
                <button
                  key={fix.id}
                  type="button"
                  className={`btn-sm ${selectedFixture.id === fix.id ? 'btn-gold' : 'btn-glass'}`}
                  onClick={() => onSelectFixture(fix.id)}
                  style={{ padding: '4px 10px', fontSize: '0.725rem' }}
                >
                  {fix.name.split(' ')[1] || fix.name}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 1-CLICK PERSPECTIVE FIT PRESETS */}
            <div style={{ background: 'rgba(212, 175, 55, 0.06)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-md)', padding: 10 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold-light)', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                1-Click Room Perspective Snapping:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 4px', fontSize: '0.68rem', textAlign: 'center' }}
                  onClick={() => applyFitPreset('left-wall')}
                  title="Fit along Left angled wall"
                >
                  Left Wall
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 4px', fontSize: '0.68rem', textAlign: 'center' }}
                  onClick={() => applyFitPreset('back-wall')}
                  title="Mounted against Rear wall"
                >
                  Back Wall
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 4px', fontSize: '0.68rem', textAlign: 'center' }}
                  onClick={() => applyFitPreset('right-wall')}
                  title="Fit along Right wall"
                >
                  Right Wall
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 4px', fontSize: '0.68rem', textAlign: 'center' }}
                  onClick={() => applyFitPreset('center-floor')}
                  title="Grounded on Center floor"
                >
                  Floor Center
                </button>
              </div>
            </div>

            {/* SECTION: HORIZONTAL POSITION (X: LEFT ⟷ RIGHT) */}
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
              <div className="control-label-row" style={{ marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--gold-primary)' }}>
                  <ArrowLeftRight size={14} /> Horizontal Position (X: Left ⟷ Right)
                </span>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>
                  {Math.round((selectedFixture.x || 0.35) * 100)}%
                </span>
              </div>

              {/* Slider with Nudge Left / Right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 8px' }}
                  onClick={() => nudge(-0.02, 0)}
                  title="Nudge Left 2%"
                >
                  <ChevronLeft size={14} />
                </button>
                <input
                  type="range"
                  min="0.0"
                  max="0.85"
                  step="0.01"
                  value={selectedFixture.x || 0.35}
                  onChange={(e) => onUpdateFixture(selectedFixture.id, { x: parseFloat(e.target.value) })}
                  className="custom-range"
                  style={{ flex: 1 }}
                  id="sanitary-pos-x-slider"
                />
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 8px' }}
                  onClick={() => nudge(0.02, 0)}
                  title="Nudge Right 2%"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Step Presets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => nudge(-0.10, 0)}
                  title="Shift Left 10%"
                >
                  -10%
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => nudge(-0.02, 0)}
                  title="Shift Left 2%"
                >
                  -2%
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => onUpdateFixture(selectedFixture.id, { x: 0.40 })}
                  title="Center horizontally"
                >
                  Center
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => nudge(0.02, 0)}
                  title="Shift Right 2%"
                >
                  +2%
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => nudge(0.10, 0)}
                  title="Shift Right 10%"
                >
                  +10%
                </button>
              </div>
            </div>

            {/* SECTION: VERTICAL POSITION (Y: FLOOR ↕ WALL ELEVATION) */}
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
              <div className="control-label-row" style={{ marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--gold-primary)' }}>
                  <ArrowUpDown size={14} /> Vertical Position (Y: Wall ↕ Floor)
                </span>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>
                  {Math.round((selectedFixture.y || 0.55) * 100)}%
                </span>
              </div>

              {/* Slider with Nudge Up / Down */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 8px' }}
                  onClick={() => nudge(0, -0.02)}
                  title="Nudge Upward 2%"
                >
                  <ChevronUp size={14} />
                </button>
                <input
                  type="range"
                  min="0.1"
                  max="0.85"
                  step="0.01"
                  value={selectedFixture.y || 0.55}
                  onChange={(e) => onUpdateFixture(selectedFixture.id, { y: parseFloat(e.target.value) })}
                  className="custom-range"
                  style={{ flex: 1 }}
                  id="sanitary-pos-y-slider"
                />
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '4px 8px' }}
                  onClick={() => nudge(0, 0.02)}
                  title="Nudge Downward 2%"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Vertical Height Presets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => nudge(0, -0.10)}
                  title="Shift Upward 10%"
                >
                  ▲ 10%
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => nudge(0, -0.02)}
                  title="Shift Upward 2%"
                >
                  ▲ 2%
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => onUpdateFixture(selectedFixture.id, { y: 0.52 })}
                  title="Wall-hung elevation"
                >
                  Wall
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => onUpdateFixture(selectedFixture.id, { y: 0.68 })}
                  title="Floor standing level"
                >
                  Floor
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 2px', fontSize: '0.65rem' }}
                  onClick={() => nudge(0, 0.10)}
                  title="Shift Downward 10%"
                >
                  ▼ 10%
                </button>
              </div>
            </div>

            {/* HORIZONTAL WIDTH & VERTICAL DEPTH SCALING */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Horizontal Width */}
              <div className="control-row" style={{ margin: 0 }}>
                <div className="control-label-row">
                  <span style={{ fontSize: '0.72rem' }}>Horizontal Width</span>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.75rem' }}>
                    {Math.round((selectedFixture.scaleX || selectedFixture.scale || 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.35"
                  max="2.2"
                  step="0.05"
                  value={selectedFixture.scaleX || selectedFixture.scale || 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateFixture(selectedFixture.id, { scaleX: val });
                  }}
                  className="custom-range"
                  id="sanitary-width-slider"
                />
              </div>

              {/* Vertical Depth */}
              <div className="control-row" style={{ margin: 0 }}>
                <div className="control-label-row">
                  <span style={{ fontSize: '0.72rem' }}>Vertical Depth</span>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.75rem' }}>
                    {Math.round((selectedFixture.scaleY || selectedFixture.scale || 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.35"
                  max="2.2"
                  step="0.05"
                  value={selectedFixture.scaleY || selectedFixture.scale || 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateFixture(selectedFixture.id, { scaleY: val });
                  }}
                  className="custom-range"
                  id="sanitary-depth-slider"
                />
              </div>
            </div>

            {/* 360° FREE ROTATION */}
            <div className="control-row">
              <div className="control-label-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RotateCw size={14} color="var(--gold-primary)" /> 360° Rotation Angle
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{Math.round(selectedFixture.rotation || 0)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={selectedFixture.rotation || 0}
                onChange={(e) => onUpdateFixture(selectedFixture.id, { rotation: parseInt(e.target.value, 10) })}
                className="custom-range"
                id="sanitary-rotation-slider"
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    className="btn-glass btn-sm"
                    style={{ padding: '3px 6px', fontSize: '0.7rem' }}
                    onClick={() => onUpdateFixture(selectedFixture.id, { rotation: deg })}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            {/* PERSPECTIVE WALL SKEW / TILT ANGLE */}
            <div className="control-row">
              <div className="control-label-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Compass size={14} color="var(--gold-primary)" /> Perspective Wall Tilt (Yaw)
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{Math.round(selectedFixture.skewX || 0)}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={selectedFixture.skewX || 0}
                onChange={(e) => onUpdateFixture(selectedFixture.id, { skewX: parseInt(e.target.value, 10) })}
                className="custom-range"
                id="sanitary-skew-slider"
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 4px', fontSize: '0.68rem' }}
                  onClick={() => onUpdateFixture(selectedFixture.id, { skewX: -14 })}
                >
                  Left Wall (-14°)
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 4px', fontSize: '0.68rem' }}
                  onClick={() => onUpdateFixture(selectedFixture.id, { skewX: 0 })}
                >
                  Flat (0°)
                </button>
                <button
                  type="button"
                  className="btn-glass btn-sm"
                  style={{ padding: '3px 4px', fontSize: '0.68rem' }}
                  onClick={() => onUpdateFixture(selectedFixture.id, { skewX: 14 })}
                >
                  Right Wall (+14°)
                </button>
              </div>
            </div>

            {/* HORIZONTAL FLIP & RESET */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className={`btn btn-sm ${selectedFixture.flipX ? 'btn-gold' : 'btn-glass'}`}
                onClick={() => onUpdateFixture(selectedFixture.id, { flipX: !selectedFixture.flipX })}
                style={{ flex: 1, fontSize: '0.78rem' }}
                id="sanitary-flip-btn"
              >
                <FlipHorizontal size={14} /> Flip Left / Right
              </button>

              <button
                type="button"
                className="btn-glass btn-sm"
                onClick={() => onUpdateFixture(selectedFixture.id, {
                  rotation: 0,
                  flipX: false,
                  scale: 1.0,
                  scaleX: 1.0,
                  scaleY: 1.0,
                  skewX: 0,
                  elevation: 0,
                  shadowIntensity: 0.55
                })}
                style={{ fontSize: '0.78rem' }}
                title="Reset transform to default"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Click &quot;+ Add to Room&quot; above to place and freely manipulate sanitary wares in the room.
        </div>
      )}
    </div>
  );
}
