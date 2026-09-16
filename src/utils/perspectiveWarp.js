/**
 * perspectiveWarp.js
 * Advanced 2D Perspective Quad Texture Mapping Engine for Polar Ceramics Visualizer.
 * Subdivides an arbitrary quadrilateral into a triangulated projective grid and renders
 * seamless tile/marble/granite textures with realistic perspective, grout lines, and lighting blend.
 */

/**
 * Solves the affine transform matrix for mapping triangle (x0,y0),(x1,y1),(x2,y2)
 * to destination triangle (u0,v0),(u1,v1),(u2,v2)
 */
function getAffineTransform(x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
  const denom = (x0 - x2) * (y1 - y2) - (x1 - x2) * (y0 - y2);
  if (Math.abs(denom) < 0.000001) return null;

  const a = ((u0 - u2) * (y1 - y2) - (u1 - u2) * (y0 - y2)) / denom;
  const b = ((u1 - u2) * (x0 - x2) - (u0 - u2) * (x1 - x2)) / denom;
  const c = u2 - a * x2 - b * y2;

  const d = ((v0 - v2) * (y1 - y2) - (v1 - v2) * (y0 - y2)) / denom;
  const e = ((v1 - v2) * (x0 - x2) - (v0 - v2) * (x1 - x2)) / denom;
  const f = v2 - d * x2 - e * y2;

  return { a, b, c, d, e, f };
}

/**
 * Creates a tiled canvas pattern of the product texture with customizable grout lines,
 * scale, and rotation.
 */
export function createTiledPatternCanvas(image, options = {}) {
  const {
    tileScale = 1.0,
    rotation = 0, // 0, 45, 90
    groutWidth = 2,
    groutColor = '#CBD5E1',
    layoutPattern = 'grid' // 'grid', 'brick'
  } = options;

  const baseSize = 256 * Math.max(0.2, Math.min(3.0, tileScale));
  const patternCanvas = document.createElement('canvas');
  const size = Math.round(baseSize);
  patternCanvas.width = size;
  patternCanvas.height = size;
  const pctx = patternCanvas.getContext('2d');

  pctx.save();

  if (rotation === 45) {
    pctx.translate(size / 2, size / 2);
    pctx.rotate((45 * Math.PI) / 180);
    pctx.drawImage(image, -size / 2, -size / 2, size, size);
  } else if (rotation === 90) {
    pctx.translate(size / 2, size / 2);
    pctx.rotate((90 * Math.PI) / 180);
    pctx.drawImage(image, -size / 2, -size / 2, size, size);
  } else {
    pctx.drawImage(image, 0, 0, size, size);
  }

  // Draw Grout Lines
  if (groutWidth > 0) {
    pctx.strokeStyle = groutColor;
    pctx.lineWidth = groutWidth;
    pctx.strokeRect(0, 0, size, size);

    if (layoutPattern === 'brick') {
      pctx.beginPath();
      pctx.moveTo(0, size / 2);
      pctx.lineTo(size, size / 2);
      pctx.moveTo(size / 2, 0);
      pctx.lineTo(size / 2, size / 2);
      pctx.stroke();
    }
  }

  pctx.restore();
  return patternCanvas;
}

/**
 * Bilinearly interpolates 4 corners of a quadrilateral:
 * p0 = Top-Left, p1 = Top-Right, p2 = Bottom-Right, p3 = Bottom-Left
 */
function interpolateQuad(p0, p1, p2, p3, u, v) {
  const topX = p0.x + (p1.x - p0.x) * u;
  const topY = p0.y + (p1.y - p0.y) * u;
  const botX = p3.x + (p2.x - p3.x) * u;
  const botY = p3.y + (p2.y - p3.y) * u;

  return {
    x: topX + (botX - topX) * v,
    y: topY + (botY - topY) * v
  };
}

/**
 * Renders the perspective-warped texture onto destination canvas.
 * Supports 4 corners or 6 endpoints [TL, TM, TR, BR, BM, BL] (or N-gon polygon).
 * @param {CanvasRenderingContext2D} ctx - Target canvas 2D context
 * @param {HTMLCanvasElement|HTMLImageElement} textureSource - Source pattern canvas or image
 * @param {Array<{x: number, y: number}>} points - 4, 6 or N polygon points
 * @param {Object} renderOptions - Blending, opacity, grid lines
 */
export function renderPerspectiveQuad(ctx, textureSource, points, renderOptions = {}) {
  if (!points || points.length < 3) return;

  const {
    blendMode = 'multiply',
    opacity = 0.9,
    subdivisions = 24, // 24x24 provides smooth perspective
    texRepeatX = 6,
    texRepeatY = 6
  } = renderOptions;

  // Determine the 4 reference corners for perspective mapping
  let p0, p1, p2, p3;
  if (points.length >= 6) {
    p0 = points[0]; // Top-Left
    p1 = points[2]; // Top-Right
    p2 = points[3]; // Bottom-Right
    p3 = points[5]; // Bottom-Left
  } else {
    p0 = points[0];
    p1 = points[1];
    p2 = points[2];
    p3 = points[3] || points[2];
  }

  const tw = textureSource.width;
  const th = textureSource.height;

  // Render on offscreen canvas for crisp clipping and composite blending
  const offscreen = document.createElement('canvas');
  offscreen.width = ctx.canvas.width;
  offscreen.height = ctx.canvas.height;
  const offCtx = offscreen.getContext('2d');

  // Clip to the EXACT polygon (supports all 6 endpoints)
  offCtx.save();
  offCtx.beginPath();
  offCtx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    offCtx.lineTo(points[i].x, points[i].y);
  }
  offCtx.closePath();
  offCtx.clip();

  const N = subdivisions;

  // Grid mesh warping using subdivided triangles across perspective projection
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const u0 = i / N;
      const u1 = (i + 1) / N;
      const v0 = j / N;
      const v1 = (j + 1) / N;

      // Map quad coordinates
      const pt00 = interpolateQuad(p0, p1, p2, p3, u0, v0);
      const pt10 = interpolateQuad(p0, p1, p2, p3, u1, v0);
      const pt11 = interpolateQuad(p0, p1, p2, p3, u1, v1);
      const pt01 = interpolateQuad(p0, p1, p2, p3, u0, v1);

      // Texture UV coordinates
      const tx0 = (u0 * texRepeatX * tw) % tw;
      const tx1 = (u1 * texRepeatX * tw) % tw;
      const ty0 = (v0 * texRepeatY * th) % th;
      const ty1 = (v1 * texRepeatY * th) % th;

      // Triangle 1: (pt00, pt10, pt01)
      renderTriangle(offCtx, textureSource,
        tx0, ty0, tx1, ty0, tx0, ty1,
        pt00.x, pt00.y, pt10.x, pt10.y, pt01.x, pt01.y
      );

      // Triangle 2: (pt10, pt11, pt01)
      renderTriangle(offCtx, textureSource,
        tx1, ty0, tx1, ty1, tx0, ty1,
        pt10.x, pt10.y, pt11.x, pt11.y, pt01.x, pt01.y
      );
    }
  }

  offCtx.restore();

  // Composite the rendered tile texture onto the main canvas with lighting blend
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = blendMode === 'normal' ? 'source-over' : blendMode;
  ctx.drawImage(offscreen, 0, 0);

  // Soft ambient specular highlight pass for polished surfaces
  if (blendMode === 'multiply') {
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.15;
    ctx.drawImage(offscreen, 0, 0);
  }

  ctx.restore();
}

/**
 * Draws a single texture-mapped triangle using affine transformation
 */
function renderTriangle(ctx, image, sx0, sy0, sx1, sy1, sx2, sy2, dx0, dy0, dx1, dy1, dx2, dy2) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(dx0, dy0);
  ctx.lineTo(dx1, dy1);
  ctx.lineTo(dx2, dy2);
  ctx.closePath();
  ctx.clip();

  const transform = getAffineTransform(sx0, sy0, sx1, sy1, sx2, sy2, dx0, dy0, dx1, dy1, dx2, dy2);
  if (transform) {
    ctx.setTransform(transform.a, transform.d, transform.b, transform.e, transform.c, transform.f);
    ctx.drawImage(image, 0, 0);
  }
  ctx.restore();
}

/**
 * Draws perspective guide lines between points (supports 6 endpoints and 4 corners)
 */
export function drawPerspectiveGuideGrid(ctx, points, options = {}) {
  if (!points || points.length < 3) return;
  const { color = '#38BDF8', lineWidth = 1.5, gridDivisions = 6 } = options;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([4, 4]);

  // Outer Polygon Outline (connects all 6 endpoints in sequence)
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.stroke();

  // Draw Vanishing Perspective Rays
  if (points.length >= 6) {
    const topPts = [points[0], points[1], points[2]];
    const botPts = [points[5], points[4], points[3]];

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(topPts[i].x, topPts[i].y);
      ctx.lineTo(botPts[i].x, botPts[i].y);
      ctx.stroke();
    }

    // Subdivided Vanishing Rays between the 3 main columns
    for (let r = 1; r < 3; r++) {
      const t = r / 3;
      // Between P0 and P1 -> P5 and P4
      const pTopA = { x: points[0].x + (points[1].x - points[0].x) * t, y: points[0].y + (points[1].y - points[0].y) * t };
      const pBotA = { x: points[5].x + (points[4].x - points[5].x) * t, y: points[5].y + (points[4].y - points[5].y) * t };
      ctx.beginPath();
      ctx.moveTo(pTopA.x, pTopA.y);
      ctx.lineTo(pBotA.x, pBotA.y);
      ctx.stroke();

      // Between P1 and P2 -> P4 and P3
      const pTopB = { x: points[1].x + (points[2].x - points[1].x) * t, y: points[1].y + (points[2].y - points[1].y) * t };
      const pBotB = { x: points[4].x + (points[3].x - points[4].x) * t, y: points[4].y + (points[3].y - points[4].y) * t };
      ctx.beginPath();
      ctx.moveTo(pTopB.x, pTopB.y);
      ctx.lineTo(pBotB.x, pBotB.y);
      ctx.stroke();
    }

    // Horizontal Perspective Rungs
    for (let j = 1; j < gridDivisions; j++) {
      const t = j / gridDivisions;
      const leftPt = { x: points[0].x + (points[5].x - points[0].x) * t, y: points[0].y + (points[5].y - points[0].y) * t };
      const midPt = { x: points[1].x + (points[4].x - points[1].x) * t, y: points[1].y + (points[4].y - points[1].y) * t };
      const rightPt = { x: points[2].x + (points[3].x - points[2].x) * t, y: points[2].y + (points[3].y - points[2].y) * t };

      ctx.beginPath();
      ctx.moveTo(leftPt.x, leftPt.y);
      ctx.lineTo(midPt.x, midPt.y);
      ctx.lineTo(rightPt.x, rightPt.y);
      ctx.stroke();
    }
  } else {
    // 4 Corner Fallback
    const [p0, p1, p2, p3] = points;
    for (let i = 1; i < gridDivisions; i++) {
      const t = i / gridDivisions;
      const topPt = { x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t };
      const botPt = { x: p3.x + (p2.x - p3.x) * t, y: p3.y + (p2.y - p3.y) * t };
      ctx.beginPath();
      ctx.moveTo(topPt.x, topPt.y);
      ctx.lineTo(botPt.x, botPt.y);
      ctx.stroke();

      const leftPt = { x: p0.x + (p3.x - p0.x) * t, y: p0.y + (p3.y - p0.y) * t };
      const rightPt = { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
      ctx.beginPath();
      ctx.moveTo(leftPt.x, leftPt.y);
      ctx.lineTo(rightPt.x, rightPt.y);
      ctx.stroke();
    }
  }

  ctx.restore();
}
