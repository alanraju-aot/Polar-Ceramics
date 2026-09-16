import React, { useRef, useState, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

export default function BeforeAfterSlider({
  splitPosition = 50,
  onChangeSplit,
  containerWidth,
  containerHeight,
  isActive = false
}) {
  const isDragging = useRef(false);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX;
    const relativeX = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (relativeX / rect.width) * 100));
    onChangeSplit(percent);
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  if (!isActive) return null;

  return (
    <div
      className="split-slider-container"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ width: containerWidth, height: containerHeight }}
    >
      <div
        className="split-divider-line"
        style={{ left: `${splitPosition}%` }}
        onPointerDown={handlePointerDown}
      >
        <div className="split-handle-knob">
          <ChevronsLeftRight size={18} color="#0b0f17" />
        </div>

        {/* Labels */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 12,
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          ORIGINAL
        </div>

        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 12,
            background: 'rgba(212,175,55,0.95)',
            color: '#0b0f17',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '4px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}
        >
          POLAR TILED
        </div>
      </div>
    </div>
  );
}
