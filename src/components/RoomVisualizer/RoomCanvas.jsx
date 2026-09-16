import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  createTiledPatternCanvas,
  renderPerspectiveQuad,
  drawPerspectiveGuideGrid
} from '../../utils/perspectiveWarp';
import BeforeAfterSlider from './BeforeAfterSlider';
import {
  RotateCw,
  FlipHorizontal,
  Trash2,
  Move,
  ArrowLeftRight,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Compass,
  Maximize2
} from 'lucide-react';

const PIN_LABELS = [
  'P1: Top-Left',
  'P2: Top-Center',
  'P3: Top-Right',
  'P4: Bottom-Right',
  'P5: Bottom-Center',
  'P6: Bottom-Left'
];

export default function RoomCanvas({
  roomImageSrc,
  selectedProduct,
  quadPoints, // Array of 6 points {x, y} in normalized coordinates (0..1)
  onChangeQuadPoints,
  isEditingPins = false,
  showGrid = true,
  customizerOptions,
  fixtures = [],
  selectedFixtureId,
  onSelectFixture,
  onUpdateFixture,
  onRemoveFixture,
  showSplitComparison = false,
  splitPosition = 50,
  onChangeSplitPosition,
  onCanvasReady
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 540 });

  // Dragging states
  const [activeDragPin, setActiveDragPin] = useState(null);
  const [activeDragFixture, setActiveDragFixture] = useState(null);
  const [activeTransformMode, setActiveTransformMode] = useState(null); // 'move', 'move-x', 'move-y', 'rotate', 'resize-x', 'resize-y', 'resize-corner'
  const transformStartRef = useRef({ startX: 0, startY: 0, initialScaleX: 1, initialScaleY: 1, initialRot: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Cached Loaded Images
  const roomImgRef = useRef(null);
  const textureImgRef = useRef(null);
  const fixtureImgsRef = useRef(new Map());

  // Currently selected fixture object
  const activeSelectedFix = fixtures.find((f) => f.id === selectedFixtureId) || (fixtures.length === 1 ? fixtures[0] : null);

  // Load Room Image
  useEffect(() => {
    if (!roomImageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = roomImageSrc;
    img.onload = () => {
      roomImgRef.current = img;

      if (containerRef.current) {
        const maxWidth = Math.min(1080, containerRef.current.clientWidth || 960);
        const aspect = img.naturalHeight / img.naturalWidth || 9 / 16;
        const calcHeight = Math.round(maxWidth * aspect);
        setDimensions({ width: maxWidth, height: calcHeight });
      }
      drawScene();
    };
  }, [roomImageSrc]);

  // Load Texture Image
  useEffect(() => {
    if (!selectedProduct?.textureUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedProduct.textureUrl;
    img.onload = () => {
      textureImgRef.current = img;
      drawScene();
    };
  }, [selectedProduct?.textureUrl]);

  // Load Fixture Images
  useEffect(() => {
    fixtures.forEach((fix) => {
      if (!fixtureImgsRef.current.has(fix.thumbnail)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = fix.thumbnail;
        img.onload = () => {
          fixtureImgsRef.current.set(fix.thumbnail, img);
          drawScene();
        };
      }
    });
  }, [fixtures]);

  // Master Render Function
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Base Room Image
    if (roomImgRef.current) {
      ctx.drawImage(roomImgRef.current, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#0f141e';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. If Split Comparison is enabled: compute split line
    let splitX = width;
    if (showSplitComparison) {
      splitX = (splitPosition / 100) * width;
    }

    // 3. Render Perspective Tile Floor
    if (textureImgRef.current && quadPoints && quadPoints.length >= 4) {
      const absCorners = quadPoints.map((p) => ({
        x: p.x * width,
        y: p.y * height
      }));

      const patternCanvas = createTiledPatternCanvas(textureImgRef.current, {
        tileScale: customizerOptions.tileScale,
        rotation: customizerOptions.rotation,
        groutWidth: customizerOptions.groutWidth,
        groutColor: customizerOptions.groutColor
      });

      ctx.save();
      if (showSplitComparison) {
        ctx.beginPath();
        ctx.rect(splitX, 0, width - splitX, height);
        ctx.clip();
      }

      renderPerspectiveQuad(ctx, patternCanvas, absCorners, {
        blendMode: customizerOptions.blendMode,
        opacity: customizerOptions.opacity,
        subdivisions: 24,
        texRepeatX: 7,
        texRepeatY: 7
      });

      ctx.restore();

      // Draw Guide Grid & 6-Endpoint Perimeter
      if (showGrid && isEditingPins) {
        drawPerspectiveGuideGrid(ctx, absCorners, {
          color: '#38BDF8',
          lineWidth: 1.5,
          gridDivisions: 6
        });
      }
    }

    // 4. Render Sanitary Fixtures with horizontal & vertical scaling, rotation, flip, and 3D skew
    fixtures.forEach((fix) => {
      const fixImg = fixtureImgsRef.current.get(fix.thumbnail);
      if (!fixImg) return;

      const scaleX = fix.scaleX || fix.scale || 1.0;
      const scaleY = fix.scaleY || fix.scale || 1.0;
      const fixW = (fix.baseWidth || 160) * scaleX;
      const fixH = (fix.baseHeight || 160) * scaleY;
      const posX = fix.x * width;
      const posY = fix.y * height + (fix.elevation || 0);

      const centerX = posX + fixW / 2;
      const centerY = posY + fixH / 2;
      const rotationRad = ((fix.rotation || 0) * Math.PI) / 180;
      const skewXRad = (((fix.skewX || 0)) * Math.PI) / 180;
      const shadowOpacity = fix.shadowIntensity ?? 0.55;

      // Realistic Directional Ground Contact Shadow
      if (shadowOpacity > 0.01) {
        ctx.save();
        ctx.translate(centerX, posY + fixH * 0.92);
        if (fix.rotation) ctx.rotate(rotationRad * 0.35);

        ctx.beginPath();
        ctx.ellipse(0, 0, fixW * 0.48, fixH * 0.16, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(5, 8, 14, ${shadowOpacity * 0.75})`;
        ctx.filter = 'blur(10px)';
        ctx.fill();

        // High occlusion core
        ctx.beginPath();
        ctx.ellipse(0, 0, fixW * 0.34, fixH * 0.09, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity * 0.9})`;
        ctx.filter = 'blur(4px)';
        ctx.fill();
        ctx.restore();
      }

      // Draw Fixture Graphic with Rotation, Flip, and Perspective Tilt
      ctx.save();
      ctx.translate(centerX, centerY);
      if (fix.flipX) {
        ctx.scale(-1, 1);
      }
      if (fix.rotation) {
        ctx.rotate(rotationRad);
      }
      if (fix.skewX) {
        ctx.transform(1, 0, Math.tan(skewXRad), 1, 0, 0);
      }
      ctx.drawImage(fixImg, -fixW / 2, -fixH / 2, fixW, fixH);
      ctx.restore();
    });
  }, [dimensions, quadPoints, customizerOptions, fixtures, showGrid, isEditingPins, showSplitComparison, splitPosition]);

  // Redraw on updates
  useEffect(() => {
    drawScene();
  }, [drawScene]);

  // Window Resize Listener
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && roomImgRef.current) {
        const maxWidth = Math.min(1080, containerRef.current.clientWidth || 960);
        const aspect = roomImgRef.current.naturalHeight / roomImgRef.current.naturalWidth || 9 / 16;
        setDimensions({ width: maxWidth, height: Math.round(maxWidth * aspect) });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WINDOW-LEVEL POINTER DRAGGING (Smooth Horizontal & Vertical manipulation)
  useEffect(() => {
    const onWindowPointerMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      // Dragging 6-Point Outline Pins
      if (activeDragPin !== null) {
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const normX = Math.max(0, Math.min(1, clientX / dimensions.width));
        const normY = Math.max(0, Math.min(1, clientY / dimensions.height));

        const newPoints = [...quadPoints];
        newPoints[activeDragPin] = {
          x: Math.round(normX * 1000) / 1000,
          y: Math.round(normY * 1000) / 1000
        };
        onChangeQuadPoints(newPoints);
      }
      // Dragging / Transforming Sanitary Ware
      else if (activeDragFixture !== null) {
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const fix = fixtures.find((f) => f.id === activeDragFixture);
        if (!fix) return;

        // FREE 2D HORIZONTAL & VERTICAL MOVEMENT
        if (activeTransformMode === 'move') {
          const normX = (clientX - dragOffsetRef.current.x) / dimensions.width;
          const normY = (clientY - dragOffsetRef.current.y) / dimensions.height;

          onUpdateFixture(activeDragFixture, {
            x: Math.max(-0.25, Math.min(1.05, Math.round(normX * 1000) / 1000)),
            y: Math.max(-0.25, Math.min(1.05, Math.round(normY * 1000) / 1000))
          });
        }
        // HORIZONTAL-ONLY MOVEMENT
        else if (activeTransformMode === 'move-x') {
          const normX = (clientX - dragOffsetRef.current.x) / dimensions.width;
          onUpdateFixture(activeDragFixture, {
            x: Math.max(-0.25, Math.min(1.05, Math.round(normX * 1000) / 1000))
          });
        }
        // VERTICAL-ONLY MOVEMENT
        else if (activeTransformMode === 'move-y') {
          const normY = (clientY - dragOffsetRef.current.y) / dimensions.height;
          onUpdateFixture(activeDragFixture, {
            y: Math.max(-0.25, Math.min(1.05, Math.round(normY * 1000) / 1000))
          });
        }
        // 360° ROTATE
        else if (activeTransformMode === 'rotate') {
          const scaleX = fix.scaleX || fix.scale || 1.0;
          const scaleY = fix.scaleY || fix.scale || 1.0;
          const fixW = (fix.baseWidth || 160) * scaleX;
          const fixH = (fix.baseHeight || 160) * scaleY;
          const centerX = fix.x * dimensions.width + fixW / 2;
          const centerY = fix.y * dimensions.height + (fix.elevation || 0) + fixH / 2;

          const rad = Math.atan2(clientY - centerY, clientX - centerX);
          let deg = Math.round((rad * 180) / Math.PI) + 90;
          if (deg < 0) deg += 360;
          onUpdateFixture(activeDragFixture, { rotation: deg });
        }
        // HORIZONTAL WIDTH RESIZE
        else if (activeTransformMode === 'resize-x') {
          const deltaX = clientX - transformStartRef.current.startX;
          const newScaleX = Math.max(0.3, Math.min(2.5, transformStartRef.current.initialScaleX + deltaX / 180));
          onUpdateFixture(activeDragFixture, {
            scaleX: Math.round(newScaleX * 100) / 100,
            scale: Math.round(newScaleX * 100) / 100
          });
        }
        // VERTICAL DEPTH / FORESHORTENING RESIZE
        else if (activeTransformMode === 'resize-y') {
          const deltaY = clientY - transformStartRef.current.startY;
          const newScaleY = Math.max(0.3, Math.min(2.5, transformStartRef.current.initialScaleY + deltaY / 180));
          onUpdateFixture(activeDragFixture, {
            scaleY: Math.round(newScaleY * 100) / 100
          });
        }
        // CORNER PROPORTIONAL RESIZE
        else if (activeTransformMode === 'resize-corner') {
          const deltaX = clientX - transformStartRef.current.startX;
          const newScale = Math.max(0.3, Math.min(2.5, transformStartRef.current.initialScaleX + deltaX / 200));
          onUpdateFixture(activeDragFixture, {
            scale: Math.round(newScale * 100) / 100,
            scaleX: Math.round(newScale * 100) / 100,
            scaleY: Math.round(newScale * 100) / 100
          });
        }
      }
    };

    const onWindowPointerUp = () => {
      setActiveDragPin(null);
      setActiveDragFixture(null);
      setActiveTransformMode(null);
    };

    if (activeDragPin !== null || activeDragFixture !== null) {
      window.addEventListener('pointermove', onWindowPointerMove);
      window.addEventListener('pointerup', onWindowPointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
    };
  }, [activeDragPin, activeDragFixture, activeTransformMode, dimensions, quadPoints, fixtures, onChangeQuadPoints, onUpdateFixture]);

  // KEYBOARD ARROW KEY NAVIGATION FOR SANITARY WARE
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeSelectedFix) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const step = e.shiftKey ? 0.05 : 0.01;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateFixture(activeSelectedFix.id, {
          x: Math.max(-0.25, Math.min(1.05, Math.round((activeSelectedFix.x - step) * 1000) / 1000))
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateFixture(activeSelectedFix.id, {
          x: Math.max(-0.25, Math.min(1.05, Math.round((activeSelectedFix.x + step) * 1000) / 1000))
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateFixture(activeSelectedFix.id, {
          y: Math.max(-0.25, Math.min(1.05, Math.round((activeSelectedFix.y - step) * 1000) / 1000))
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateFixture(activeSelectedFix.id, {
          y: Math.max(-0.25, Math.min(1.05, Math.round((activeSelectedFix.y + step) * 1000) / 1000))
        });
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onUpdateFixture(activeSelectedFix.id, { rotation: ((activeSelectedFix.rotation || 0) + 15) % 360 });
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        onUpdateFixture(activeSelectedFix.id, { flipX: !activeSelectedFix.flipX });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onRemoveFixture(activeSelectedFix.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSelectedFix, onUpdateFixture, onRemoveFixture]);

  // Pointer Down Handlers
  const handlePinPointerDown = (index, e) => {
    e.stopPropagation();
    setActiveDragPin(index);
  };

  const handleFixturePointerDown = (fixtureId, mode, e) => {
    e.stopPropagation();
    setActiveDragFixture(fixtureId);
    setActiveTransformMode(mode || 'move');
    onSelectFixture?.(fixtureId);

    const rect = canvasRef.current.getBoundingClientRect();
    const fix = fixtures.find((f) => f.id === fixtureId);
    if (fix) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left - fix.x * dimensions.width,
        y: e.clientY - rect.top - fix.y * dimensions.height
      };
    }
  };

  const handleRotatePointerDown = (fixtureId, e) => {
    e.stopPropagation();
    setActiveDragFixture(fixtureId);
    setActiveTransformMode('rotate');
  };

  const handleResizePointerDown = (fixtureId, mode, e) => {
    e.stopPropagation();
    setActiveDragFixture(fixtureId);
    setActiveTransformMode(mode);
    const fix = fixtures.find((f) => f.id === fixtureId);
    transformStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialScaleX: fix?.scaleX || fix?.scale || 1.0,
      initialScaleY: fix?.scaleY || fix?.scale || 1.0,
      initialRot: fix?.rotation || 0
    };
  };

  // Quick Wall / Floor Fit Presets
  const applyQuickFit = (fixtureId, preset) => {
    if (preset === 'left-wall') {
      onUpdateFixture(fixtureId, {
        x: 0.10,
        y: 0.54,
        rotation: 14,
        skewX: -14,
        flipX: false,
        scaleX: 0.88,
        scaleY: 0.86
      });
    } else if (preset === 'right-wall') {
      onUpdateFixture(fixtureId, {
        x: 0.66,
        y: 0.54,
        rotation: -14,
        skewX: 14,
        flipX: true,
        scaleX: 0.88,
        scaleY: 0.86
      });
    } else if (preset === 'center-floor') {
      onUpdateFixture(fixtureId, {
        x: 0.36,
        y: 0.68,
        rotation: 0,
        skewX: 0,
        flipX: false,
        scaleX: 1.0,
        scaleY: 0.92
      });
    } else if (preset === 'back-wall') {
      onUpdateFixture(fixtureId, {
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

  // Nudge helper for on-canvas buttons
  const nudgeFixture = (fixtureId, dx, dy) => {
    const fix = fixtures.find((f) => f.id === fixtureId);
    if (!fix) return;
    onUpdateFixture(fixtureId, {
      x: Math.max(-0.25, Math.min(1.05, Math.round((fix.x + dx) * 1000) / 1000)),
      y: Math.max(-0.25, Math.min(1.05, Math.round((fix.y + dy) * 1000) / 1000))
    });
  };

  // Expose Snapshot function to parent
  useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady({
        exportSnapshot: (product) => {
          const exportCanvas = document.createElement('canvas');
          const exportW = 1920;
          const exportH = Math.round((dimensions.height / dimensions.width) * 1920);
          exportCanvas.width = exportW;
          exportCanvas.height = exportH + 110;
          const ectx = exportCanvas.getContext('2d');

          ectx.drawImage(canvasRef.current, 0, 0, exportW, exportH);

          // Watermark Banner
          ectx.fillStyle = '#0b0f17';
          ectx.fillRect(0, exportH, exportW, 110);
          ectx.strokeStyle = '#D4AF37';
          ectx.lineWidth = 3;
          ectx.strokeRect(0, exportH, exportW, 110);

          ectx.fillStyle = '#D4AF37';
          ectx.font = 'bold 28px sans-serif';
          ectx.fillText('POLAR CERAMICS & SURFACES', 40, exportH + 45);

          ectx.fillStyle = '#94A3B8';
          ectx.font = '16px sans-serif';
          ectx.fillText('3D Architectural Room Visualizer Preview (6-Point Precision Fit)', 40, exportH + 75);

          if (product) {
            ectx.fillStyle = '#FFFFFF';
            ectx.font = 'bold 24px sans-serif';
            ectx.textAlign = 'right';
            ectx.fillText(`${product.name} (${product.finish})`, exportW - 40, exportH + 45);

            ectx.fillStyle = '#E5C158';
            ectx.font = 'bold 20px sans-serif';
            ectx.fillText(`Rate: ₹${product.price}/${product.unit}  •  SKU: ${product.sku}`, exportW - 40, exportH + 75);
          }

          const link = document.createElement('a');
          link.download = `Polar-Ceramics-${product?.name?.replace(/\s+/g, '-') || 'Room-Preview'}.png`;
          link.href = exportCanvas.toDataURL('image/png');
          link.click();
        }
      });
    }
  }, [dimensions, onCanvasReady]);

  return (
    <div
      ref={containerRef}
      className="vis-stage"
      style={{ userSelect: 'none' }}
    >
      <div
        className="vis-canvas-container"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <canvas
          ref={canvasRef}
          className="vis-canvas"
          style={{ width: dimensions.width, height: dimensions.height }}
        />

        {/* 6 Draggable Boundary Pins [P1..P3: Top, P4..P6: Bottom] */}
        {isEditingPins && quadPoints && quadPoints.map((pt, idx) => {
          const pinMargin = 16;
          const posX = Math.max(pinMargin, Math.min(dimensions.width - pinMargin, pt.x * dimensions.width));
          const posY = Math.max(pinMargin, Math.min(dimensions.height - pinMargin, pt.y * dimensions.height));
          const isBottomPin = idx >= 3;

          return (
            <div
              key={idx}
              className={`perspective-pin ${isBottomPin ? 'bottom-pin' : 'top-pin'}`}
              style={{ left: posX, top: posY }}
              onPointerDown={(e) => handlePinPointerDown(idx, e)}
              id={`pin-${idx}`}
              title={`Drag ${PIN_LABELS[idx] || `P${idx + 1}`} to adjust floor boundary`}
            >
              <span>{idx + 1}</span>
              <div className="pin-label">{PIN_LABELS[idx] || `P${idx + 1}`}</div>
            </div>
          );
        })}

        {/* Fixtures Synchronized Transform Bounding Boxes Overlay */}
        {fixtures.map((fix) => {
          const isSelected = selectedFixtureId === fix.id || (fixtures.length === 1 && !selectedFixtureId);
          const scaleX = fix.scaleX || fix.scale || 1.0;
          const scaleY = fix.scaleY || fix.scale || 1.0;
          const posX = fix.x * dimensions.width;
          const posY = fix.y * dimensions.height + (fix.elevation || 0);
          const fixW = (fix.baseWidth || 160) * scaleX;
          const fixH = (fix.baseHeight || 160) * scaleY;

          return (
            <div
              key={fix.id}
              style={{
                position: 'absolute',
                left: posX,
                top: posY,
                width: fixW,
                height: fixH,
                transformOrigin: 'center center',
                transform: `rotate(${fix.rotation || 0}deg) skewX(${fix.skewX || 0}deg)`,
                cursor: activeTransformMode?.startsWith('move') ? 'grabbing' : 'grab',
                border: isSelected ? '2px dashed var(--gold-primary)' : '1px dashed transparent',
                borderRadius: 'var(--radius-sm)',
                pointerEvents: isEditingPins ? 'none' : 'auto',
                boxShadow: isSelected ? '0 0 20px rgba(212,175,55,0.45)' : 'none',
                touchAction: 'none'
              }}
              onPointerDown={(e) => handleFixturePointerDown(fix.id, 'move', e)}
              title="Click and drag anywhere to move horizontally & vertically. Use Arrow keys to nudge."
            >
              {/* Transform Handles & Directional Controls when selected */}
              {isSelected && !isEditingPins && (
                <>
                  {/* Center Drag Anchor Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(11, 15, 23, 0.88)',
                      border: '1.5px solid var(--gold-primary)',
                      borderRadius: 20,
                      padding: '3px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'var(--gold-light)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                      pointerEvents: 'none'
                    }}
                  >
                    <Move size={12} color="var(--gold-primary)" />
                    <span>Move</span>
                  </div>

                  {/* Top Rotation Knob with Angle Display */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -34,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'grab',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleRotatePointerDown(fix.id, e)}
                    title="Drag to rotate 360°"
                  >
                    <div
                      style={{
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: 'var(--gold-primary)',
                        color: '#000',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.7)',
                        border: '1.5px solid #fff'
                      }}
                    >
                      <RotateCw size={10} color="#000" />
                      <span>{Math.round(fix.rotation || 0)}°</span>
                    </div>
                    <div style={{ width: 1.5, height: 10, background: 'var(--gold-primary)' }} />
                  </div>

                  {/* LEFT HANDLE: Horizontal Move Left Arrow & Drag Grip */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: -14,
                      transform: 'translateY(-50%)',
                      width: 22,
                      height: 28,
                      borderRadius: 4,
                      background: '#0B0F17',
                      border: '1.5px solid var(--gold-primary)',
                      color: 'var(--gold-light)',
                      cursor: 'ew-resize',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleFixturePointerDown(fix.id, 'move-x', e)}
                    onClick={(e) => {
                      e.stopPropagation();
                      nudgeFixture(fix.id, -0.02, 0);
                    }}
                    title="Drag Horizontally, or Click to Nudge Left"
                  >
                    <ChevronLeft size={16} />
                  </div>

                  {/* RIGHT HANDLE: Horizontal Move Right Arrow & Drag Grip */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: -14,
                      transform: 'translateY(-50%)',
                      width: 22,
                      height: 28,
                      borderRadius: 4,
                      background: '#0B0F17',
                      border: '1.5px solid var(--gold-primary)',
                      color: 'var(--gold-light)',
                      cursor: 'ew-resize',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleFixturePointerDown(fix.id, 'move-x', e)}
                    onClick={(e) => {
                      e.stopPropagation();
                      nudgeFixture(fix.id, 0.02, 0);
                    }}
                    title="Drag Horizontally, or Click to Nudge Right"
                  >
                    <ChevronRight size={16} />
                  </div>

                  {/* TOP HANDLE: Vertical Move Up Arrow & Drag Grip */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 28,
                      height: 20,
                      borderRadius: 4,
                      background: '#0B0F17',
                      border: '1.5px solid var(--gold-primary)',
                      color: 'var(--gold-light)',
                      cursor: 'ns-resize',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleFixturePointerDown(fix.id, 'move-y', e)}
                    onClick={(e) => {
                      e.stopPropagation();
                      nudgeFixture(fix.id, 0, -0.02);
                    }}
                    title="Drag Vertically, or Click to Nudge Upward (Wall mount)"
                  >
                    <ChevronUp size={16} />
                  </div>

                  {/* BOTTOM HANDLE: Vertical Move Down Arrow & Drag Grip */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 28,
                      height: 20,
                      borderRadius: 4,
                      background: '#0B0F17',
                      border: '1.5px solid var(--gold-primary)',
                      color: 'var(--gold-light)',
                      cursor: 'ns-resize',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleFixturePointerDown(fix.id, 'move-y', e)}
                    onClick={(e) => {
                      e.stopPropagation();
                      nudgeFixture(fix.id, 0, 0.02);
                    }}
                    title="Drag Vertically, or Click to Nudge Downward (Floor)"
                  >
                    <ChevronDown size={16} />
                  </div>

                  {/* Right Edge: Horizontal Width Stretch */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: -8,
                      width: 14,
                      height: 22,
                      borderRadius: 3,
                      background: 'var(--gold-primary)',
                      border: '1.5px solid #fff',
                      cursor: 'ew-resize',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleResizePointerDown(fix.id, 'resize-x', e)}
                    title="Drag to adjust Horizontal Width"
                  >
                    <ArrowLeftRight size={8} color="#000" />
                  </div>

                  {/* Bottom Edge: Vertical Depth Stretch */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -8,
                      left: 12,
                      width: 22,
                      height: 14,
                      borderRadius: 3,
                      background: 'var(--gold-primary)',
                      border: '1.5px solid #fff',
                      cursor: 'ns-resize',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleResizePointerDown(fix.id, 'resize-y', e)}
                    title="Drag to adjust Vertical Depth / Floor Pitch"
                  >
                    <ArrowUpDown size={8} color="#000" />
                  </div>

                  {/* Corner Proportional Resize Grip */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: 'var(--gold-primary)',
                      border: '2px solid #fff',
                      cursor: 'nwse-resize',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handleResizePointerDown(fix.id, 'resize-corner', e)}
                    title="Drag corner for proportional resize"
                  />

                  {/* Quick Action Dock on Top-Right */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -34,
                      right: -10,
                      display: 'flex',
                      gap: 4
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateFixture(fix.id, { flipX: !fix.flipX });
                      }}
                      style={{
                        background: '#0B0F17',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--gold-light)',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Flip Left/Right"
                    >
                      <FlipHorizontal size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFixture(fix.id);
                      }}
                      style={{
                        background: '#0B0F17',
                        border: '1px solid rgba(244,63,94,0.5)',
                        color: '#f43f5e',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Delete fixture"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Floating Quick Wall-Fit Bar Under Fixture */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -38,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(11, 15, 23, 0.94)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: 18,
                      padding: '2px 6px',
                      display: 'flex',
                      gap: 4,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.7)',
                      zIndex: 10
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => applyQuickFit(fix.id, 'left-wall')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        padding: '2px 5px',
                        cursor: 'pointer',
                        borderRadius: 4
                      }}
                      title="Fit to Left Wall (Angle & Height)"
                    >
                      Left Wall
                    </button>
                    <span style={{ color: 'var(--border-subtle)' }}>|</span>
                    <button
                      type="button"
                      onClick={() => applyQuickFit(fix.id, 'back-wall')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        padding: '2px 5px',
                        cursor: 'pointer',
                        borderRadius: 4
                      }}
                      title="Fit to Back Wall"
                    >
                      Back Wall
                    </button>
                    <span style={{ color: 'var(--border-subtle)' }}>|</span>
                    <button
                      type="button"
                      onClick={() => applyQuickFit(fix.id, 'right-wall')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        padding: '2px 5px',
                        cursor: 'pointer',
                        borderRadius: 4
                      }}
                      title="Fit to Right Wall"
                    >
                      Right Wall
                    </button>
                    <span style={{ color: 'var(--border-subtle)' }}>|</span>
                    <button
                      type="button"
                      onClick={() => applyQuickFit(fix.id, 'center-floor')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--gold-light)',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        padding: '2px 5px',
                        cursor: 'pointer',
                        borderRadius: 4
                      }}
                      title="Grounded on Floor"
                    >
                      Floor
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* ON-SCREEN FLOATING SANITARY ADJUSTMENT HUD (Bottom Viewport Toolbar) */}
        {activeSelectedFix && !isEditingPins && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(11, 15, 23, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
              zIndex: 30,
              maxWidth: '92%'
            }}
          >
            {/* Fixture Info */}
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-subtle)', paddingRight: 12 }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Active Fixture
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                {activeSelectedFix.name.replace('Polar ', '')}
              </span>
            </div>

            {/* Horizontal Adjustments */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowLeftRight size={13} /> X:
              </span>
              <button
                type="button"
                className="btn-glass btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.68rem' }}
                onClick={() => nudgeFixture(activeSelectedFix.id, -0.02, 0)}
                title="Nudge Left"
              >
                ◀ Left
              </button>
              <input
                type="range"
                min="0.0"
                max="0.85"
                step="0.01"
                value={activeSelectedFix.x || 0.35}
                onChange={(e) => onUpdateFixture(activeSelectedFix.id, { x: parseFloat(e.target.value) })}
                className="custom-range"
                style={{ width: 70 }}
                title={`Horizontal Position: ${Math.round((activeSelectedFix.x || 0.35) * 100)}%`}
              />
              <button
                type="button"
                className="btn-glass btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.68rem' }}
                onClick={() => nudgeFixture(activeSelectedFix.id, 0.02, 0)}
                title="Nudge Right"
              >
                Right ▶
              </button>
            </div>

            {/* Vertical Adjustments */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpDown size={13} /> Y:
              </span>
              <button
                type="button"
                className="btn-glass btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.68rem' }}
                onClick={() => nudgeFixture(activeSelectedFix.id, 0, -0.02)}
                title="Nudge Upward (Wall Elevation)"
              >
                ▲ Up
              </button>
              <input
                type="range"
                min="0.1"
                max="0.85"
                step="0.01"
                value={activeSelectedFix.y || 0.55}
                onChange={(e) => onUpdateFixture(activeSelectedFix.id, { y: parseFloat(e.target.value) })}
                className="custom-range"
                style={{ width: 70 }}
                title={`Vertical Position: ${Math.round((activeSelectedFix.y || 0.55) * 100)}%`}
              />
              <button
                type="button"
                className="btn-glass btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.68rem' }}
                onClick={() => nudgeFixture(activeSelectedFix.id, 0, 0.02)}
                title="Nudge Downward (Floor)"
              >
                Down ▼
              </button>
            </div>

            {/* 3D Wall Tilt / Skew */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Compass size={13} /> Tilt:
              </span>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={activeSelectedFix.skewX || 0}
                onChange={(e) => onUpdateFixture(activeSelectedFix.id, { skewX: parseInt(e.target.value, 10) })}
                className="custom-range"
                style={{ width: 60 }}
                title={`Perspective Wall Tilt: ${Math.round(activeSelectedFix.skewX || 0)}°`}
              />
              <span style={{ fontSize: '0.68rem', color: '#fff', minWidth: 26, textAlign: 'right' }}>
                {Math.round(activeSelectedFix.skewX || 0)}°
              </span>
            </div>

            {/* Quick Keyboard Hint */}
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
              <span>⌨ Arrow keys: Nudge</span>
            </div>
          </div>
        )}

        {/* Before / After Comparison Split Slider */}
        <BeforeAfterSlider
          isActive={showSplitComparison}
          splitPosition={splitPosition}
          onChangeSplit={onChangeSplitPosition}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      </div>
    </div>
  );
}
