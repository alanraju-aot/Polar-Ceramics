const fs = require('fs');
const path = require('path');

const texturesDir = path.join(__dirname, '..', 'public', 'textures');
const sanitaryDir = path.join(__dirname, '..', 'public', 'sanitary');
const roomsDir = path.join(__dirname, '..', 'public', 'rooms');

if (!fs.existsSync(texturesDir)) fs.mkdirSync(texturesDir, { recursive: true });
if (!fs.existsSync(sanitaryDir)) fs.mkdirSync(sanitaryDir, { recursive: true });
if (!fs.existsSync(roomsDir)) fs.mkdirSync(roomsDir, { recursive: true });

// --- 1. PHOTOREALISTIC 3/4 PERSPECTIVE WALL-HUNG SMART COMMODE ---
// Designed specifically for realistic eye-level bathroom perspective placement
const commodeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="640" viewBox="0 0 540 640">
  <defs>
    <!-- Multi-Layer Realistic Ambient Occlusion & Floor Contact Shadow -->
    <filter id="commodeFloorShadow" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="32" stdDeviation="24" flood-color="#05070A" flood-opacity="0.65" />
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <!-- Vitreous China 3D Shading -->
    <radialGradient id="ceramicSphere" cx="42%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#F8FAFC" />
      <stop offset="75%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#94A3B8" />
    </radialGradient>
    <linearGradient id="wallFlangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>
    <!-- Brushed Chrome / Gold Dual Flush Plate -->
    <linearGradient id="chromePlate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="25%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#94A3B8" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
    <linearGradient id="goldButton" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FCEBA6" />
      <stop offset="45%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#8C6E19" />
    </linearGradient>
    <!-- Soft porcelain specular highlight -->
    <linearGradient id="specularRim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#CBD5E1" stop-opacity="0.6" />
    </linearGradient>
    <!-- Subtle LED under-bowl glow -->
    <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#38BDF8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.0" />
    </radialGradient>
  </defs>

  <g filter="url(#commodeFloorShadow)">
    <!-- 0. Under-Bowl Ambient LED Floor Wash -->
    <ellipse cx="270" cy="570" rx="160" ry="38" fill="url(#ledGlow)" />

    <!-- 1. Wall Mount Concealed Cistern Flush Actuator (Mounted Flat to Wall Behind) -->
    <rect x="180" y="30" width="180" height="110" rx="14" fill="url(#wallFlangeGrad)" stroke="#64748B" stroke-width="2" />
    <rect x="190" y="40" width="160" height="90" rx="10" fill="url(#chromePlate)" stroke="#94A3B8" stroke-width="1.5" />
    <!-- Buttons -->
    <rect x="225" y="60" width="40" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
    <rect x="275" y="60" width="40" height="50" rx="8" fill="url(#goldButton)" stroke="#B8942A" stroke-width="1.5" />

    <!-- 2. Wall-Hung Ceramic Bracket Base (Mounting Hub) -->
    <path d="M 160 140 L 380 140 L 390 220 L 150 220 Z" fill="#94A3B8" opacity="0.4" />

    <!-- 3. Cantilevered 3/4 Perspective Vitreous China Bowl (Extending Forward & Floating) -->
    <!-- Underside Occlusion Shading Curve -->
    <path d="M 140 310 C 140 450, 190 530, 270 530 C 350 530, 400 450, 400 310 C 350 420, 290 470, 270 470 C 250 470, 190 420, 140 310 Z" 
          fill="#64748B" opacity="0.6" filter="blur(3px)" />

    <!-- Sculpted Floating Bowl Body -->
    <path d="M 155 170 
             C 140 220, 130 330, 150 420 
             C 170 490, 210 535, 270 535 
             C 330 535, 370 490, 390 420 
             C 410 330, 400 220, 385 170 
             Z" 
          fill="url(#ceramicSphere)" 
          stroke="#CBD5E1" 
          stroke-width="2.5" />

    <!-- Front Perspective Tapered Underside Chamfer -->
    <path d="M 175 420 C 210 500, 330 500, 365 420 C 340 460, 200 460, 175 420 Z" 
          fill="#94A3B8" opacity="0.35" />

    <!-- 4. Modern Slim Ergonomic Seat & Soft-Close Lid (Slightly Angled in 3/4 Perspective) -->
    <ellipse cx="270" cy="270" rx="122" ry="115" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
    
    <!-- Chrome Seat Hinge Cover Plates -->
    <circle cx="215" cy="180" r="11" fill="url(#chromePlate)" stroke="#64748B" stroke-width="1.5" />
    <circle cx="325" cy="180" r="11" fill="url(#chromePlate)" stroke="#64748B" stroke-width="1.5" />

    <!-- Inner Seat Rim Ring -->
    <ellipse cx="270" cy="285" rx="98" ry="92" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <ellipse cx="270" cy="295" rx="76" ry="72" fill="#EEF2F6" stroke="#CBD5E1" stroke-width="1.5" />

    <!-- Deep Water Trap & Bowl Well -->
    <ellipse cx="270" cy="315" rx="46" ry="42" fill="#CBD5E1" />
    <ellipse cx="270" cy="322" rx="30" ry="26" fill="#94A3B8" />

    <!-- Cyan Ambient Nightlight LED Ring -->
    <ellipse cx="270" cy="290" rx="90" ry="86" fill="none" stroke="#38BDF8" stroke-width="2" opacity="0.8" filter="blur(1px)" />

    <!-- Front Specular Glaze Reflection -->
    <path d="M 160 250 C 160 190, 210 160, 270 160 C 330 160, 380 190, 380 250" 
          fill="none" stroke="url(#specularRim)" stroke-width="4.5" stroke-linecap="round" />
    <path d="M 170 380 C 200 460, 340 460, 370 380" 
          fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.75" />
  </g>
</svg>`;
fs.writeFileSync(path.join(sanitaryDir, 'wall-hung-commode.svg'), commodeSvg);

// --- 2. PHOTOREALISTIC 3/4 PERSPECTIVE DESIGNER VESSEL BASIN & GOLD FAUCET ---
const basinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480">
  <defs>
    <filter id="basinFloorShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="28" stdDeviation="22" flood-color="#000000" flood-opacity="0.55" />
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#0B0F17" flood-opacity="0.4" />
    </filter>
    <radialGradient id="basinExterior" cx="45%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#F1F5F9" />
      <stop offset="80%" stop-color="#DCE3EA" />
      <stop offset="100%" stop-color="#94A3B8" />
    </radialGradient>
    <!-- Brushed Champagne Gold Metal Shader -->
    <linearGradient id="champagneGoldTap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C59E33" />
      <stop offset="25%" stop-color="#FCEBA6" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="80%" stop-color="#8C6E19" />
      <stop offset="100%" stop-color="#E5C158" />
    </linearGradient>
  </defs>

  <g filter="url(#basinFloorShadow)">
    <!-- Countertop / Plinth Contact Shadow -->
    <ellipse cx="300" cy="380" rx="230" ry="26" fill="#05070A" opacity="0.5" filter="blur(8px)" />

    <!-- 1. Luxury Tall Champagne Gold Monobloc Faucet (Standing Behind Basin in 3/4 Perspective) -->
    <!-- Base Plinth -->
    <ellipse cx="300" cy="130" rx="24" ry="9" fill="url(#champagneGoldTap)" stroke="#785B12" stroke-width="1.5" />
    <!-- Vertical Pillar Column -->
    <rect x="286" y="55" width="28" height="80" fill="url(#champagneGoldTap)" stroke="#8C6E19" stroke-width="1.5" />
    <!-- Mixer Single Lever Handle -->
    <path d="M 282 52 L 318 52 L 345 40 L 340 34 L 300 44 Z" fill="url(#champagneGoldTap)" stroke="#785B12" stroke-width="1" />
    <!-- Curved High Arch Spout -->
    <path d="M 300 55 C 300 -5, 370 -5, 370 50 L 364 95" 
          fill="none" stroke="url(#champagneGoldTap)" stroke-width="20" stroke-linecap="round" />
    <ellipse cx="364" cy="98" rx="9" ry="5" fill="#222" />
    <circle cx="364" cy="98" r="3.5" fill="#D4AF37" />

    <!-- 2. Sculpted Ceramic Vessel Outer Shell in 3/4 Perspective -->
    <path d="M 85 240 
             C 85 350, 180 405, 300 405 
             C 420 405, 515 350, 515 240 
             C 515 190, 420 150, 300 150 
             C 180 150, 85 190, 85 240 Z" 
          fill="url(#basinExterior)" 
          stroke="#CAD5E0" 
          stroke-width="2.5" />

    <!-- Outer Rim Highlight Ring -->
    <ellipse cx="300" cy="235" rx="215" ry="85" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3" />

    <!-- Inner Basin Cavity Deep Chamber -->
    <ellipse cx="300" cy="245" rx="188" ry="68" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <ellipse cx="300" cy="258" rx="150" ry="50" fill="#EDF2F7" />

    <!-- Water Basin Sheen Shimmer Layer -->
    <ellipse cx="300" cy="272" rx="112" ry="34" fill="#E2EAF2" opacity="0.85" />
    
    <!-- Pop-Up Click-Clack Gold Drain Stopper -->
    <ellipse cx="300" cy="282" rx="18" ry="9" fill="url(#champagneGoldTap)" stroke="#8C6E19" stroke-width="1.5" />

    <!-- Front Lip Specular Glaze Reflection -->
    <path d="M 125 250 C 200 310, 400 310, 475 250" 
          fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.85" />
  </g>
</svg>`;
fs.writeFileSync(path.join(sanitaryDir, 'vessel-basin.svg'), basinSvg);

// --- 3. PHOTOREALISTIC 3/4 PERSPECTIVE FREESTANDING SOAKING BATHTUB ---
const bathtubSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="520" viewBox="0 0 760 520">
  <defs>
    <filter id="tubFloorShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="36" stdDeviation="28" flood-color="#000000" flood-opacity="0.6" />
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#0B0E14" flood-opacity="0.45" />
    </filter>
    <radialGradient id="tubShellGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="45%" stop-color="#F8FAFC" />
      <stop offset="80%" stop-color="#D9E3EB" />
      <stop offset="100%" stop-color="#94A3B8" />
    </radialGradient>
    <linearGradient id="tubRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#DEE7EF" />
      <stop offset="25%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="75%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#CBD8E2" />
    </linearGradient>
    <linearGradient id="bathFillerGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C59E33" />
      <stop offset="35%" stop-color="#FCEBA6" />
      <stop offset="65%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#8C6E19" />
    </linearGradient>
  </defs>

  <g filter="url(#tubFloorShadow)">
    <!-- Floor-Standing Champagne Gold Bath Filler Column (Beside Bathtub in 3/4 Perspective) -->
    <ellipse cx="660" cy="390" rx="24" ry="10" fill="url(#bathFillerGold)" stroke="#785B12" stroke-width="1.5" />
    <rect x="650" y="140" width="20" height="255" fill="url(#bathFillerGold)" stroke="#8C6E19" stroke-width="1.5" />
    <!-- Spout Neck Arch over Tub -->
    <path d="M 660 140 C 660 80, 595 80, 590 150" fill="none" stroke="url(#bathFillerGold)" stroke-width="16" stroke-linecap="round" />
    <!-- Hand Shower Wand Bracket & Hose -->
    <rect x="670" y="210" width="10" height="50" rx="4" fill="url(#bathFillerGold)" />
    <path d="M 675 260 C 690 310, 675 350, 660 385" fill="none" stroke="#D4AF37" stroke-width="3.5" stroke-dasharray="2,2" />

    <!-- 1. Outer Bathtub Sculpted Shell in 3/4 Perspective -->
    <path d="M 70 210 
             C 70 120, 180 80, 360 80 
             C 540 80, 650 120, 650 210 
             C 650 350, 560 450, 360 450 
             C 160 450, 70 350, 70 210 Z" 
          fill="url(#tubShellGrad)" 
          stroke="#CBD5E1" 
          stroke-width="3" />

    <!-- Bottom Contact Ambient Occlusion -->
    <path d="M 160 410 C 250 445, 470 445, 560 410 C 510 445, 210 445, 160 410 Z" 
          fill="#0B0E14" opacity="0.4" filter="blur(4px)" />

    <!-- 2. Tub Upper Lip Rim -->
    <ellipse cx="360" cy="205" rx="285" ry="110" fill="url(#tubRimGrad)" stroke="#CBD5E0" stroke-width="3.5" />

    <!-- 3. Inner Deep Soaking Chamber -->
    <ellipse cx="360" cy="215" rx="255" ry="90" fill="#F8FAFC" stroke="#D1DCE5" stroke-width="2.5" />
    <ellipse cx="360" cy="232" rx="225" ry="70" fill="#EDF3F8" />
    
    <!-- Water Shimmer & Reflection Plane -->
    <ellipse cx="360" cy="250" rx="190" ry="50" fill="#DEEAF4" opacity="0.9" />
    
    <!-- Center Luxury Pop-Up Drain -->
    <ellipse cx="360" cy="268" rx="18" ry="8" fill="url(#bathFillerGold)" stroke="#8C6E19" stroke-width="1.5" />

    <!-- Crisp Glaze Highlight along Outer Contour -->
    <path d="M 120 235 C 230 330, 490 330, 600 235" 
          fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.85" />
  </g>
</svg>`;
fs.writeFileSync(path.join(sanitaryDir, 'freestanding-bathtub.svg'), bathtubSvg);

// --- 4. PHOTOREALISTIC 3/4 PERSPECTIVE FLOATING MARBLE & FLUTED WOOD VANITY ---
const vanitySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="420" viewBox="0 0 620 420">
  <defs>
    <filter id="vanityShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="28" stdDeviation="22" flood-color="#000000" flood-opacity="0.55" />
    </filter>
    <linearGradient id="statuarioSlab" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="45%" stop-color="#F4F6F8" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <linearGradient id="smokedOakWood" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3D291D" />
      <stop offset="50%" stop-color="#281A12" />
      <stop offset="100%" stop-color="#190F0A" />
    </linearGradient>
    <linearGradient id="vanityGoldBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C59E33" />
      <stop offset="50%" stop-color="#FCEBA6" />
      <stop offset="100%" stop-color="#997A1E" />
    </linearGradient>
  </defs>

  <g filter="url(#vanityShadow)">
    <!-- 1. Floating Fluted Smoked Oak Wooden Vanity Cabinet -->
    <rect x="70" y="170" width="480" height="160" rx="8" fill="url(#smokedOakWood)" stroke="#190F0A" stroke-width="2" />

    <!-- Fluted Vertical Wood Slat Slits -->
    <g stroke="#140B07" stroke-width="2.5" opacity="0.8">
      ${Array.from({ length: 30 }).map((_, i) => `<line x1="${85 + i * 15.5}" y1="172" x2="${85 + i * 15.5}" y2="328" />`).join('')}
    </g>

    <!-- Champagne Gold Horizontal Pull Handles -->
    <rect x="160" y="240" width="90" height="7" rx="3.5" fill="url(#vanityGoldBar)" stroke="#785B12" stroke-width="1" />
    <rect x="370" y="240" width="90" height="7" rx="3.5" fill="url(#vanityGoldBar)" stroke="#785B12" stroke-width="1" />

    <!-- 2. Italian Statuario White Marble Seamless Countertop Slab (Beveled Edge in 3/4 Perspective) -->
    <polygon points="50,170 570,170 555,115 65,115" fill="url(#statuarioSlab)" stroke="#CAD5E0" stroke-width="2" />
    <!-- Subtle Grey Marble Veins on Countertop -->
    <path d="M 120 125 Q 200 140 320 130 T 490 150" stroke="#94A3B8" stroke-width="3" fill="none" opacity="0.4" filter="blur(1px)" />
    <!-- Countertop Front Apron -->
    <rect x="50" y="165" width="520" height="16" rx="3" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="1" />

    <!-- 3. Integrated Undermount Ceramic Basin -->
    <ellipse cx="310" cy="140" rx="90" ry="26" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2" />
    <ellipse cx="310" cy="143" rx="70" ry="18" fill="#EDF2F7" />
    <!-- Gold Basin Click-Clack Stopper -->
    <ellipse cx="310" cy="147" rx="11" ry="4" fill="url(#vanityGoldBar)" />

    <!-- 4. Contemporary Tall Champagne Gold Mixer Faucet -->
    <rect x="304" y="68" width="12" height="52" fill="url(#vanityGoldBar)" stroke="#785B12" stroke-width="1" />
    <path d="M 310 68 C 310 35, 345 35, 345 62 L 342 85" fill="none" stroke="url(#vanityGoldBar)" stroke-width="11" stroke-linecap="round" />
  </g>
</svg>`;
fs.writeFileSync(path.join(sanitaryDir, 'vanity-cabinet.svg'), vanitySvg);

console.log('Successfully generated ultra-realistic 3/4 perspective elevation sanitary wares!');
