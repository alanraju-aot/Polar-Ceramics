import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Eye,
  Sliders,
  Maximize2,
  Download,
  ShoppingBag,
  Sparkles,
  Upload,
  Layers,
  HelpCircle,
  Calculator,
  Grid,
  ChevronsLeftRight
} from 'lucide-react';
import RoomCanvas from './RoomCanvas';
import TileCustomizer from './TileCustomizer';
import PerspectiveControls from './PerspectiveControls';
import CustomerUploader from './CustomerUploader';
import SanitaryOverlay from './SanitaryOverlay';
import { SAMPLE_ROOMS, DEFAULT_CUSTOMER_POINTS } from '../../data/sampleRooms';

export default function VisualizerModal({
  isOpen,
  onClose,
  initialProduct,
  allProducts,
  onAddToQuote,
  onOpenEstimator
}) {
  const [activeProduct, setActiveProduct] = useState(initialProduct || allProducts[0]);
  const [activeRoomId, setActiveRoomId] = useState('living-hall');
  const [customRoomImage, setCustomRoomImage] = useState(null);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms', 'customize', 'products', 'sanitary'
  const [activeSurface, setActiveSurface] = useState('floor');

  // Surface Quad Points (in normalized coordinates 0..1)
  const [quadPoints, setQuadPoints] = useState(SAMPLE_ROOMS[0].surfaces.floor.points);
  const [isEditingPins, setIsEditingPins] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  // Before / After Split Comparison
  const [showSplitComparison, setShowSplitComparison] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);

  // Tile Customizer Options
  const [customizerOptions, setCustomizerOptions] = useState({
    tileScale: 1.0,
    rotation: 0,
    groutWidth: 2,
    groutColor: '#C4C9D0',
    blendMode: 'multiply',
    opacity: 0.85
  });

  // Sanitary Fixtures placed on canvas
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState(null);
  const canvasApiRef = useRef(null);

  // Active Room Configuration
  const currentRoom = SAMPLE_ROOMS.find((r) => r.id === activeRoomId) || SAMPLE_ROOMS[0];
  const roomImageSrc = customRoomImage || currentRoom.image;

  // Change Room Preset
  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
    setCustomRoomImage(null);
    const room = SAMPLE_ROOMS.find((r) => r.id === roomId);
    if (room) {
      const surf = room.surfaces[activeSurface] || room.surfaces.floor;
      setQuadPoints(surf.points);
      setCustomizerOptions((prev) => ({
        ...prev,
        tileScale: surf.defaultScale || prev.tileScale,
        rotation: surf.defaultRotation || 0,
        groutColor: surf.groutColor || prev.groutColor,
        groutWidth: surf.groutWidth !== undefined ? surf.groutWidth : prev.groutWidth,
        blendMode: surf.blendMode || prev.blendMode,
        opacity: surf.lightingIntensity || prev.opacity
      }));
    }
  };

  // Sync initial product when opened from product card
  useEffect(() => {
    if (initialProduct) {
      setActiveProduct(initialProduct);

      // If product recommends bathroom, switch to luxury bathroom
      if (initialProduct.recommendedRooms?.includes('Luxury Bathroom') && activeRoomId === 'living-hall') {
        handleSelectRoom('luxury-bathroom');
      }
    }
  }, [initialProduct]);

  // Switch Surface (Floor vs Wall)
  const handleChangeSurface = (surfaceType) => {
    setActiveSurface(surfaceType);
    if (currentRoom.surfaces[surfaceType]) {
      setQuadPoints(currentRoom.surfaces[surfaceType].points);
    }
  };

  // Reset Points to default for current room
  const handleResetPoints = () => {
    if (customRoomImage) {
      setQuadPoints(DEFAULT_CUSTOMER_POINTS);
    } else {
      const surf = currentRoom.surfaces[activeSurface] || currentRoom.surfaces.floor;
      setQuadPoints(surf.points);
    }
  };

  // Customer Room Photo Uploaded
  const handleCustomerPhotoLoaded = (dataUrl) => {
    setCustomRoomImage(dataUrl);
    setActiveRoomId('customer-upload');
    setQuadPoints(DEFAULT_CUSTOMER_POINTS);
    setIsEditingPins(true); // Automatically open pin editing so they can align the floor!
    setActiveTab('customize');
  };

  // Load Demo Customer Room
  const handleLoadDemoCustomerRoom = () => {
    handleSelectRoom('customer-demo-room');
    setIsEditingPins(true);
  };

  // Sanitary Fixtures Management
  const sanitaryProducts = allProducts.filter((p) => p.category === 'sanitary');

  const handleAddFixture = (product) => {
    const newFix = {
      id: `fix-${Date.now()}`,
      productId: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      x: 0.35,
      y: 0.55,
      scale: 1.0,
      rotation: 0,
      flipX: false,
      elevation: 0,
      shadowIntensity: 0.55,
      baseWidth: 160,
      baseHeight: 160
    };
    setFixtures((prev) => [...prev, newFix]);
    setSelectedFixtureId(newFix.id);
    setActiveTab('sanitary');
  };

  const handleRemoveFixture = (fixtureId) => {
    setFixtures((prev) => prev.filter((f) => f.id !== fixtureId));
    if (selectedFixtureId === fixtureId) {
      setSelectedFixtureId(null);
    }
  };

  const handleUpdateFixture = (fixtureId, updates) => {
    setFixtures((prev) =>
      prev.map((f) => (f.id === fixtureId ? { ...f, ...updates } : f))
    );
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="visualizer-overlay" id="room-visualizer-modal">
      {/* Top Studio Bar */}
      <div className="vis-header">
        <div className="vis-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge-gold">
              <Eye size={14} /> 3D Room Studio
            </span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
              {customRoomImage ? 'Custom Customer Photo' : currentRoom.name}
            </span>
          </div>

          {/* Active Product Pill */}
          <div className="vis-active-product-chip">
            <img
              src={activeProduct.thumbnail}
              alt={activeProduct.name}
              className="vis-product-swatch"
            />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                {activeProduct.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold-light)' }}>
                ₹{activeProduct.price}/{activeProduct.unit} • {activeProduct.finish}
              </div>
            </div>
          </div>
        </div>

        {/* Top Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Split Screen Slider Toggle */}
          <button
            type="button"
            className={`btn-sm ${showSplitComparison ? 'btn-gold' : 'btn-glass'}`}
            onClick={() => setShowSplitComparison(!showSplitComparison)}
            id="toggle-split-compare-btn"
            title="Wipe slider between original room and new tiles"
          >
            <ChevronsLeftRight size={15} /> Split Compare
          </button>

          {/* Download Snapshot Button */}
          <button
            type="button"
            className="btn-glass btn-sm"
            onClick={() => canvasApiRef.current?.exportSnapshot(activeProduct)}
            id="download-snapshot-btn"
            title="Download high-resolution image with specs stamp"
          >
            <Download size={15} /> Export Image
          </button>

          {/* Cost Estimator */}
          <button
            type="button"
            className="btn-glass btn-sm"
            onClick={() => onOpenEstimator(activeProduct)}
            title="Calculate boxes and cost"
          >
            <Calculator size={15} /> Cost
          </button>

          {/* Add to Quote */}
          <button
            type="button"
            className="btn-gold btn-sm"
            onClick={() => onAddToQuote(activeProduct)}
          >
            <ShoppingBag size={15} /> Add to Quote
          </button>

          {/* Close Studio */}
          <button
            type="button"
            className="btn btn-glass btn-icon"
            onClick={onClose}
            id="close-visualizer-btn"
            title="Close Visualizer (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="vis-main-layout">
        {/* Left Stage / Canvas Viewport */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <RoomCanvas
            roomImageSrc={roomImageSrc}
            selectedProduct={activeProduct}
            quadPoints={quadPoints}
            onChangeQuadPoints={setQuadPoints}
            isEditingPins={isEditingPins}
            showGrid={showGrid}
            customizerOptions={customizerOptions}
            fixtures={fixtures}
            selectedFixtureId={selectedFixtureId}
            onSelectFixture={setSelectedFixtureId}
            onUpdateFixture={handleUpdateFixture}
            onRemoveFixture={handleRemoveFixture}
            showSplitComparison={showSplitComparison}
            splitPosition={splitPosition}
            onChangeSplitPosition={setSplitPosition}
            onCanvasReady={(api) => {
              canvasApiRef.current = api;
            }}
          />

          {/* Floating Quick Toolbar (Floats at top when editing pins so bottom floor pins are 100% visible) */}
          <div className={`vis-floating-toolbar ${isEditingPins ? 'toolbar-top' : 'toolbar-bottom'}`}>
            {isEditingPins && (
              <span className="badge-gold" style={{ fontSize: '0.72rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} /> 6 Endpoints: 3 Top + 3 Bottom
              </span>
            )}
            <button
              type="button"
              className={`btn-sm ${isEditingPins ? 'btn-gold' : 'btn-glass'}`}
              onClick={() => setIsEditingPins(!isEditingPins)}
              id="toolbar-drag-pins-btn"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              <Sliders size={14} /> {isEditingPins ? '✓ Lock Perspective' : 'Adjust Floor Pins'}
            </button>

            <button
              type="button"
              className={`btn-glass btn-sm ${showGrid ? 'active' : ''}`}
              onClick={() => setShowGrid(!showGrid)}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                color: showGrid ? 'var(--gold-light)' : 'inherit'
              }}
            >
              <Grid size={14} /> Grid
            </button>

            <button
              type="button"
              className="btn-glass btn-sm"
              onClick={handleResetPoints}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Sidebar Control Panel */}
        <div className="vis-sidebar">
          {/* Navigation Tabs */}
          <div className="vis-tabs">
            <button
              type="button"
              className={`vis-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
              id="vis-tab-rooms"
            >
              Rooms & Photo
            </button>
            <button
              type="button"
              className={`vis-tab-btn ${activeTab === 'customize' ? 'active' : ''}`}
              onClick={() => setActiveTab('customize')}
              id="vis-tab-customize"
            >
              Surface Style
            </button>
            <button
              type="button"
              className={`vis-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
              id="vis-tab-products"
            >
              Swatches
            </button>
            <button
              type="button"
              className={`vis-tab-btn ${activeTab === 'sanitary' ? 'active' : ''}`}
              onClick={() => setActiveTab('sanitary')}
              id="vis-tab-sanitary"
            >
              Sanitary ({fixtures.length})
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="vis-tab-content">
            {/* TAB 1: ROOM PRESETS & CUSTOM PHOTO UPLOADER */}
            {activeTab === 'rooms' && (
              <div>
                <div className="sidebar-heading">Sample Room Presets</div>
                <div className="room-preset-grid" style={{ marginBottom: 24 }}>
                  {SAMPLE_ROOMS.filter(r => !r.isDemoUpload).map((room) => (
                    <div
                      key={room.id}
                      className={`room-thumb-card ${activeRoomId === room.id && !customRoomImage ? 'active' : ''}`}
                      onClick={() => handleSelectRoom(room.id)}
                      id={`preset-room-${room.id}`}
                    >
                      <img src={room.image} alt={room.name} />
                      <div className="room-thumb-label">{room.name}</div>
                    </div>
                  ))}
                </div>

                <div className="sidebar-heading">Or Upload Customer Room</div>
                <CustomerUploader
                  onImageLoaded={handleCustomerPhotoLoaded}
                  onSelectSampleDemo={handleLoadDemoCustomerRoom}
                />
              </div>
            )}

            {/* TAB 2: SURFACE & TILE CUSTOMIZATION */}
            {activeTab === 'customize' && (
              <div>
                <PerspectiveControls
                  isEditingPins={isEditingPins}
                  onToggleEditPins={() => setIsEditingPins(!isEditingPins)}
                  showGrid={showGrid}
                  onToggleShowGrid={() => setShowGrid(!showGrid)}
                  onResetPoints={handleResetPoints}
                  activeSurface={activeSurface}
                  onChangeSurface={handleChangeSurface}
                  availableSurfaces={Object.keys(currentRoom.surfaces)}
                />

                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '18px 0' }} />

                <div className="sidebar-heading">Tile & Grout Texture Controls</div>
                <TileCustomizer
                  options={customizerOptions}
                  onChange={setCustomizerOptions}
                />
              </div>
            )}

            {/* TAB 3: PRODUCT SWATCH PICKER */}
            {activeTab === 'products' && (
              <div>
                <div className="sidebar-heading">Swap Design on Surface</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                  Click any marble, granite, or tile to update the room floor in real-time.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {allProducts.filter(p => p.category !== 'sanitary').map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setActiveProduct(p)}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: `1px solid ${activeProduct.id === p.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: 8,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        boxShadow: activeProduct.id === p.id ? '0 0 12px rgba(212,175,55,0.3)' : 'none'
                      }}
                      id={`swatch-btn-${p.id}`}
                    >
                      <div style={{ height: 75, borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 6 }}>
                        <img
                          src={p.thumbnail}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gold-light)' }}>
                        ₹{p.price}/{p.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SANITARY WARE OVERLAY */}
            {activeTab === 'sanitary' && (
              <SanitaryOverlay
                sanitaryItems={sanitaryProducts}
                activeFixtures={fixtures}
                selectedFixtureId={selectedFixtureId}
                onSelectFixture={setSelectedFixtureId}
                onAddFixture={handleAddFixture}
                onRemoveFixture={handleRemoveFixture}
                onUpdateFixture={handleUpdateFixture}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
