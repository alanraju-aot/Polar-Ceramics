# Polar Ceramics & Surfaces

> **Luxury Tiles, Italian Marbles, Granites & Designer Sanitary Studio**  
> An interactive digital showroom and architectural **3D Room Visualizer** engineered for premium surface selection, real-time perspective floor/wall fitting, and transparent cost estimation.

---

## 📸 Overview & Live Demo

Polar Ceramics & Surfaces allows architects, interior designers, and homeowners to visualize luxury surface materials and sanitary fixtures directly in pre-configured luxury spaces or **inside their own uploaded room photos** with true 3D projective perspective.

---

## ✨ Key Functionalities & Features

### 1. 📐 Interactive 3D Room Visualizer ("See in Room / Hall")
- **6-Endpoint Boundary Calibration (3 Top + 3 Bottom)**:
  - Six draggable, numbered control endpoints:
    - **P1: Top-Left** (1), **P2: Top-Center** (2), **P3: Top-Right** (3)
    - **P6: Bottom-Left** (6), **P5: Bottom-Center** (5), **P4: Bottom-Right** (4)
  - Carve and adjust tiles with precision around sofas, coffee tables, kitchen islands, and angled walls.
  - Subdivided projective 2D homography mesh with automatic boundary polygon clipping.
- **Surface & Grout Texture Controls**:
  - **Tile Scale**: Shrink or enlarge tile sizes (0.5x to 2.5x).
  - **Tile Pattern Rotation**: Standard (0°), Diamond / Herringbone (45°), and Perpendicular (90°).
  - **Grout Width & Color**: Adjust grout thickness (0mm to 6mm) and pick grout hues to match mortar/epoxy.
  - **Lighting & Blend Modes**: Realistic `multiply` and specular reflection `screen` blending over room shadows.
- **Before / After Split Compare Wipe Slider**:
  - Drag an interactive divider across the room to see original flooring vs. newly fitted tile/marble surfaces side by side.
- **Pre-Configured Luxury Room Presets**:
  - **Grand Living Hall**: High-ceiling open salon with floor-to-ceiling bay windows.
  - **Master Luxury Bathroom**: Spa bathroom with freestanding tub and ambient cove lighting.
  - **Contemporary Kitchen**: Modern chef kitchen with waterfall marble island.
  - **Executive Bedroom Suite**: Balcony lounge room with warm dusk lighting.

---

### 2. 🚽 Advanced Sanitary Ware Freeform 3D Fitting
- **Photorealistic 3/4 Perspective Elevation Models**:
  - **Aura Rimless Smart Wall-Hung Closet**: Cantilevered vitreous china bowl, concealed cistern flush plate with chrome/gold dual actuators, and under-bowl cyan LED illumination reflected on the floor tiles.
  - **Elysium Freestanding Soaking Tub**: Matte white organic oval tub resting on the floor with floor-mounted champagne gold mixer faucet and handheld shower wand.
  - **Vortex Pure Vanity Vessel Basin**: Counter-mounted oval basin with tall gold monobloc faucet.
  - **Floating Marble Vanity Console**: Fluted smoked oak cabinet with Italian Statuario marble countertop slab and undermount sink.
- **Synchronized 3D Transform Bounding Box**:
  - Rotating or tilting the fixture keeps the bounding box, handles, and labels in **100% lockstep synchronization**.
- **On-Canvas Directional Navigation**:
  - **Center `✥ Move` Badge**: Click and drag anywhere inside the fixture to move it across the room.
  - **Horizontal Move Buttons (`◀` Left | Right `▶`)**: Nudge left/right by 2% or drag horizontally.
  - **Vertical Move Buttons (`▲` Up | Down `▼`)**: Nudge up (wall elevation) or down (floor rest) by 2% or drag vertically.
  - **Horizontal Width (`↔`) & Vertical Depth (`↕`)**: Stretch width or foreshorten depth to match perspective floor pitch.
  - **Top Rotation Pill**: Displays real-time angle (e.g. `14°`, `90°`) with 360° drag knob.
- **1-Click Perspective Wall Snapping**:
  - `Left Wall`: Snaps fixture flush along the angled left perspective wall (X: 10%, Y: 54%, 14° angle, -14° tilt).
  - `Back Wall`: Aligns fixture centered against the rear wall (X: 42%, Y: 46%, 0° angle).
  - `Right Wall`: Snaps fixture along the right wall with horizontal flip (X: 66%, Y: 54%, -14° angle, +14° tilt).
  - `Floor Center`: Grounds fixture naturally on the center floor with soft ambient contact drop shadows.
- **On-Screen Floating Viewport HUD & Keyboard Controls**:
  - Sliders for Horizontal Position (X), Vertical Position (Y), and Wall Tilt (Yaw) right at the bottom of the room viewport.
  - Use keyboard **Arrow Keys (`←`, `→`, `↑`, `↓`)** to nudge positions in real time (hold `Shift` for 5% steps).

---

### 3. 📸 Customer Room Photo Uploader
- Upload any personal room photo (living hall, bedroom, bathroom, patio) via drag-and-drop or file picker.
- The 6-endpoint outline tool automatically opens, allowing users to map their own room floor in seconds.
- Try it instantly with the built-in **"Simulated Customer Demo Room"** preset.

---

### 4. 💎 Product Catalog, Transparent Pricing & Quotations
- **Curated Stone & Tile Collection**:
  - **Italian Marbles**: Statuario Royale, Nero Marquina, Calacatta Gold, Royal Botticino.
  - **Granites**: Black Galaxy Granite, Tan Brown Granite, Blue Macaubas Quartzite.
  - **Vitrified Tiles**: Venetian Terrazzo, Moroccan Azure Encaustic, Chevron Smoked Oak, Concrete Raw.
  - **Sanitary Wares**: Smart Wall-Hung Closets, Soaking Tubs, Counter Basins, Floating Vanities.
- **Transparent Rates**: Every product displays rates per sq.ft / piece, finish, thickness, and stock status.
- **Filter & Search**: Quick filter by material category (Marble, Granite, Tiles, Sanitary) or surface finish.
- **Instant Cost Estimator**:
  - Input room length and width in feet.
  - Automatically calculates total sq.ft, boxes needed (with 10% recommended wastage buffer), and total price in ₹ (INR).
- **Branded Snapshot Export**:
  - Generates high-resolution (1920px) PNG downloads with the Polar Ceramics watermark stamp, product specifications, SKU, and pricing.
- **Quote Request Drawer**:
  - Add multiple products to a quotation cart and submit directly via WhatsApp with pre-filled line items.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| **Styling** | Custom Vanilla CSS Design System (Obsidian & Champagne Gold Theme, Glassmorphism, Responsive Grid) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Rendering Engine** | HTML5 Canvas 2D Projective Mesh & Homography Perspective Warping |
| **Asset Generation** | Node.js SVG procedural shaders & vector models |

---

## 🚀 How to Run the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (Version **18.18.2** or higher recommended)
- `npm` (bundled with Node.js)

### Step 1: Clone the Repository
```bash
git clone https://github.com/alanraju-aot/Polar-Ceramics.git
cd Polar-Ceramics
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### Step 4: Build for Production (Optional)
To test or build the optimized production bundle:
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Folder Structure

```
Polar-Ceramics/
├── public/                     # Static assets served directly
│   ├── favicon.svg             # Browser tab icon (Polar emblem)
│   ├── logo.svg                # Vector brand logo (Obsidian & Champagne Gold)
│   ├── rooms/                  # Pre-calibrated sample room backgrounds
│   │   ├── living-hall.jpg
│   │   ├── luxury-bathroom.jpg
│   │   ├── modern-kitchen.jpg
│   │   ├── master-bedroom.jpg
│   │   └── customer-sample-room.svg
│   ├── textures/               # High-res seamless tile, marble & granite textures
│   │   ├── statuario-white.jpg
│   │   ├── black-galaxy.jpg
│   │   ├── calacatta-gold.svg
│   │   ├── nero-marquina.svg
│   │   └── ...
│   └── sanitary/               # 3/4 perspective elevation sanitary ware SVGs
│       ├── wall-hung-commode.svg
│       ├── freestanding-bathtub.svg
│       ├── vessel-basin.svg
│       └── vanity-cabinet.svg
├── scripts/
│   └── create-textures.cjs     # Generator script for procedural textures & sanitary SVGs
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Header with logo, navigation & quote trigger
│   │   ├── Hero.jsx            # Hero banner with primary CTA & stats
│   │   ├── ProductCatalog.jsx  # Filterable product grid with live pricing
│   │   ├── ProductCard.jsx     # Individual card with "See in Room" & "Add to Quote"
│   │   ├── ProductDetailModal.jsx # Detailed specs modal (dimensions, slip rating)
│   │   ├── BrandStory.jsx      # Craftsmanship, heritage & showroom USP
│   │   ├── CostEstimatorModal.jsx # Square-footage box & price calculator
│   │   ├── QuoteDrawer.jsx     # Side cart drawer with WhatsApp RFQ integration
│   │   ├── Footer.jsx          # Studio footer with contact, hours & legal links
│   │   └── RoomVisualizer/     # Core 3D visualizer module
│   │       ├── VisualizerModal.jsx     # Studio modal dialog & active state manager
│   │       ├── RoomCanvas.jsx          # Canvas renderer with 6-point pins & sanitary overlay
│   │       ├── SanitaryOverlay.jsx     # Sidebar controls for sanitary position & tilt
│   │       ├── TileCustomizer.jsx      # Grout, scale & blend mode controls
│   │       ├── PerspectiveControls.jsx # 6-endpoint calibration guidance
│   │       ├── CustomerUploader.jsx    # Drag-and-drop customer room uploader
│   │       └── BeforeAfterSlider.jsx   # Split-screen comparison wipe slider
│   ├── data/
│   │   ├── products.js         # Master catalog data (16 luxury products with rates)
│   │   └── sampleRooms.js      # Sample rooms with calibrated 6-endpoint coordinates
│   ├── utils/
│   │   ├── formatters.js       # Indian Rupee (₹) currency & dimension formatters
│   │   └── perspectiveWarp.js  # Projective affine grid subdivision engine
│   ├── App.jsx                 # Application entry point & state orchestrator
│   ├── index.css               # Complete luxury design system & CSS tokens
│   └── main.jsx                # React DOM root mounting
├── index.html                  # HTML entry with luxury typography
├── package.json                # Project scripts and dependencies
└── vite.config.js              # Vite configuration
```

---

## 🖼️ Where and How to Add Images & Products

### 1. Adding New Room Photos (Backgrounds)
1. **Place the Image**: Save your high-resolution room photo (JPG or PNG, 1920x1080 recommended) in:
   ```
   public/rooms/your-room-name.jpg
   ```
2. **Register the Room**: Open `src/data/sampleRooms.js` and add a new room object to `SAMPLE_ROOMS`:
   ```javascript
   {
     id: 'villa-patio',
     name: 'Outdoor Villa Patio',
     category: 'Outdoor & Patio',
     subtitle: 'Modern terrace lounge with natural daylight',
     image: '/rooms/villa-patio.jpg',
     defaultSurface: 'floor',
     surfaces: {
       floor: {
         name: 'Patio Floor',
         // 6 Endpoints: 3 Top [P1, P2, P3] and 3 Bottom [P4, P5, P6]
         // Coordinates normalized from 0.0 to 1.0 (X: 0=Left, 1=Right; Y: 0=Top, 1=Bottom)
         points: [
           { x: 0.10, y: 0.55 }, // P1: Top-Left
           { x: 0.50, y: 0.55 }, // P2: Top-Center
           { x: 0.90, y: 0.55 }, // P3: Top-Right
           { x: 0.94, y: 0.90 }, // P4: Bottom-Right
           { x: 0.50, y: 0.90 }, // P5: Bottom-Center
           { x: 0.06, y: 0.90 }  // P6: Bottom-Left
         ],
         defaultScale: 1.0,
         defaultRotation: 0,
         groutColor: '#C4C9D0',
         groutWidth: 2,
         blendMode: 'multiply',
         lightingIntensity: 0.82
       }
     }
   }
   ```

---

### 2. Adding New Tile, Granite, or Marble Textures
1. **Place the Texture Image**: Save a seamless, repeatable texture file (JPG, PNG, or SVG) in:
   ```
   public/textures/your-stone-name.jpg
   ```
   *(Ensure texture is square, e.g. 1024x1024, and repeats seamlessly for optimal tiling)*.
2. **Register the Product**: Open `src/data/products.js` and add an entry:
   ```javascript
   {
     id: 'prod-your-stone',
     name: 'Royal Armani Bronze Marble',
     category: 'marble', // 'marble' | 'granite' | 'tiles' | 'sanitary'
     price: 420,
     unit: 'sq.ft',
     origin: 'Spain',
     finish: 'Polished Mirror',
     dimensions: '8ft x 4ft Slabs',
     thickness: '18mm',
     recommendedRooms: ['Grand Living Hall', 'Contemporary Kitchen'],
     thumbnail: '/textures/your-stone-name.jpg',
     textureUrl: '/textures/your-stone-name.jpg',
     rating: 4.9,
     reviewsCount: 24,
     inStock: true,
     sku: 'POL-MAR-009',
     description: 'Deep espresso-bronze Italian marble with golden caramel spider veining.'
   }
   ```

---

### 3. Adding New Sanitary Ware Fixtures
1. **Place the Graphic**: Save a transparent 3/4 perspective elevation image (SVG or transparent PNG) in:
   ```
   public/sanitary/your-fixture-name.svg
   ```
   *(For best realism, use a 3/4 front elevation angle rather than a flat top-down view)*.
2. **Register in Products**: In `src/data/products.js`, add the fixture under `category: 'sanitary'`:
   ```javascript
   {
     id: 'prod-gold-shower',
     name: 'Polar Celestial Thermostatic Rain Shower System',
     category: 'sanitary',
     price: 28500,
     unit: 'set',
     origin: 'Germany',
     finish: 'Brushed Champagne Gold',
     dimensions: '12-inch Head, Hand Wand & Spout',
     thickness: 'Solid Brass Core',
     recommendedRooms: ['Master Luxury Bathroom'],
     thumbnail: '/sanitary/your-fixture-name.svg',
     rating: 4.9,
     reviewsCount: 38,
     inStock: true,
     sku: 'POL-SAN-005',
     description: 'Concealed thermostatic luxury shower valve with anti-scald cartridge and rain shower head.'
   }
   ```
3. **Re-generating Procedural Vectors (Optional)**:
   If editing SVG graphics programmatically, edit `scripts/create-textures.cjs` and run:
   ```bash
   node scripts/create-textures.cjs
   ```

---

### 4. Updating the Logo & Brand Identity
- **Logo Graphic**: Replace `public/logo.svg` (used in Navbar, Footer, and snapshot exports).
- **Browser Favicon**: Replace `public/favicon.svg`.

---

## 💡 Keyboard Shortcuts in Visualizer

When the 3D Room Visualizer is open and a sanitary fixture is selected:
- `←` `→` `↑` `↓` : Nudge horizontal and vertical position by 1% (hold `Shift` for 5% steps).
- `R` : Rotate fixture clockwise by 15°.
- `F` : Flip fixture horizontally (mirror left/right).
- `Delete` or `Backspace` : Remove fixture from room.
- `Escape` : Close visualizer studio.

---

## 📜 License
Copyright © 2026 **Polar Ceramics & Surfaces**. All rights reserved.
