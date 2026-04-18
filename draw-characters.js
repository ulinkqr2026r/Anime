/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — draw-characters.js
   Canvas-based character renderer with:
   - Multiple poses (stand, jump, run, sit…)
   - Full expression system
   - Lip sync mouth shapes
   - Walk animation (leg cycles)
   - Hair, eyes, eyebrows, extras
═══════════════════════════════════════════ */

/**
 * Main entry: draws one character at (x,y) with scale s
 * @param {CanvasRenderingContext2D} c
 * @param {number} x  center X
 * @param {number} y  hip/feet Y
 * @param {number} s  scale factor
 * @param {object} char  {skin, hair, shirt}
 * @param {string} exprId
 * @param {string} pose
 * @param {number} walkPhase  0-1 for leg cycle animation
 * @param {string} mouthOverride  manual mouth shape id (or null)
 */
function drawCharacter(c, x, y, s, char, exprId, pose, walkPhase, mouthOverride) {
  const u = 80 * s;
  // Ground shadow
  c.save();
  c.globalAlpha = .14;
  c.fillStyle = '#000';
  c.beginPath();
  c.ellipse(x, y + u * .88, u * .42, u * .08, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();

  const wp = walkPhase || 0;
  drawBody(c, x, y, s, char, pose, wp);
  drawHead(c, x, y - u * .55, s, char);
  drawExpression(c, x, y - u * .55, s, exprId, mouthOverride);
  drawHair(c, x, y - u * .55, s, char, exprId);
}

/* ── BODY ── */
function drawBody(c, x, y, s, char, pose, wp) {
  const u = 80 * s;
  const skinC = char.skin || '#f4a261';
  const shirtC = char.shirt || '#e63946';

  if (pose === 'sit') {
    _drawSit(c, x, y, u, skinC, shirtC, char);
    return;
  }
  if (pose === 'run' || pose === 'walk') {
    _drawRunWalk(c, x, y, u, skinC, shirtC, char, wp);
    return;
  }

  // Default upright stances
  _drawLegs(c, x, y, u, pose, wp);
  _drawShoes(c, x, y, u, pose, wp);
  _drawTorso(c, x, y, u, shirtC, char);
  _drawArms(c, x, y, u, skinC, shirtC, pose, wp);
}

function _drawLegs(c, x, y, u, pose, wp) {
  c.fillStyle = '#222';
  if (pose === 'jump') {
    c.save(); c.translate(x - u*.15, y + u*.3); c.rotate(.4);
    c.fillRect(-u*.1, -u*.1, u*.18, u*.38); c.restore();
    c.save(); c.translate(x + u*.15, y + u*.3); c.rotate(-.4);
    c.fillRect(-u*.08, -u*.1, u*.18, u*.38); c.restore();
  } else if (pose === 'bow') {
    c.save(); c.translate(x - u*.1, y + u*.25); c.rotate(.15);
    c.fillRect(-u*.1, 0, u*.18, u*.5); c.restore();
    c.save(); c.translate(x + u*.1, y + u*.25); c.rotate(-.15);
    c.fillRect(-u*.08, 0, u*.18, u*.5); c.restore();
  } else {
    // Standard stand — slight idle sway from wp
    const sway = Math.sin(wp * Math.PI * 2) * u * .02;
    c.fillRect(x - u*.22 + sway, y + u*.32, u*.18, u*.52);
    c.fillRect(x + u*.04 - sway, y + u*.32, u*.18, u*.52);
  }
}

function _drawShoes(c, x, y, u, pose, wp) {
  c.fillStyle = '#111';
  const sway = Math.sin(wp * Math.PI * 2) * u * .02;
  if (pose === 'jump') {
    c.beginPath(); c.ellipse(x - u*.13, y + u*.78, u*.18, u*.07, .15, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.13, y + u*.78, u*.18, u*.07, -.15, 0, Math.PI*2); c.fill();
  } else {
    c.beginPath(); c.ellipse(x - u*.13 + sway, y + u*.86, u*.18, u*.07, 0, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.13 - sway, y + u*.86, u*.18, u*.07, 0, 0, Math.PI*2); c.fill();
  }
}

function _drawTorso(c, x, y, u, shirtC, char) {
  c.fillStyle = shirtC;
  c.beginPath();
  c.moveTo(x - u*.28, y + u*.02); c.lineTo(x + u*.28, y + u*.02);
  c.lineTo(x + u*.22, y + u*.35); c.lineTo(x - u*.22, y + u*.35);
  c.closePath(); c.fill();
  // Shirt detail / collar
  c.fillStyle = darken(shirtC, 22);
  c.fillRect(x - u*.04, y + u*.04, u*.08, u*.18);
  c.fillStyle = lighten(shirtC, 35);
  c.beginPath();
  c.moveTo(x - u*.07, y + u*.02); c.lineTo(x, y + u*.11); c.lineTo(x + u*.07, y + u*.02);
  c.closePath(); c.fill();
  // Neck
  c.fillStyle = char.skin || '#f4a261';
  c.fillRect(x - u*.07, y - u*.04, u*.14, u*.08);
}

function _drawArms(c, x, y, u, skinC, shirtC, pose, wp) {
  c.fillStyle = skinC;
  if (pose === 'arms') {
    c.save(); c.translate(x - u*.35, y + u*.05); c.rotate(-.9);
    c.fillRect(-u*.08, -u*.2, u*.15, u*.28); c.restore();
    c.save(); c.translate(x + u*.35, y + u*.05); c.rotate(.9);
    c.fillRect(-u*.08, -u*.2, u*.15, u*.28); c.restore();
    c.beginPath(); c.ellipse(x - u*.55, y - u*.1, u*.1, u*.09, 0, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.55, y - u*.1, u*.1, u*.09, 0, 0, Math.PI*2); c.fill();
  } else if (pose === 'point') {
    c.beginPath(); c.ellipse(x - u*.36, y + u*.2, u*.09, u*.22, -.2, 0, Math.PI*2); c.fill();
    c.save(); c.translate(x + u*.38, y + u*.08); c.rotate(-.4);
    c.fillRect(-u*.06, -u*.04, u*.26, u*.12); c.restore();
    c.beginPath(); c.ellipse(x + u*.66, y + u*.02, u*.05, u*.04, -.4, 0, Math.PI*2); c.fill();
  } else if (pose === 'facepalm') {
    c.beginPath(); c.ellipse(x - u*.36, y + u*.18, u*.09, u*.22, -.2, 0, Math.PI*2); c.fill();
    c.save(); c.translate(x + u*.28, y - u*.08); c.rotate(.6);
    c.fillRect(-u*.06, 0, u*.14, u*.22); c.restore();
    c.beginPath(); c.ellipse(x + u*.19, y - u*.12, u*.13, u*.1, 0, 0, Math.PI*2); c.fill();
  } else if (pose === 'jump') {
    c.beginPath(); c.ellipse(x - u*.38, y + u*.15, u*.09, u*.22, -.3, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.38, y + u*.15, u*.09, u*.22, .3, 0, Math.PI*2); c.fill();
  } else if (pose === 'bow') {
    c.beginPath(); c.ellipse(x - u*.3, y + u*.3, u*.1, u*.09, .5, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.3, y + u*.3, u*.1, u*.09, -.5, 0, Math.PI*2); c.fill();
  } else {
    // Stand — gentle swing with walk phase
    const swing = Math.sin(wp * Math.PI * 2) * u * .05;
    c.beginPath(); c.ellipse(x - u*.36, y + u*.18 + swing, u*.09, u*.22, -.2, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.36, y + u*.18 - swing, u*.09, u*.22, .2, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x - u*.38, y + u*.37 + swing, u*.1, u*.09, -.1, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.38, y + u*.37 - swing, u*.1, u*.09, .1, 0, Math.PI*2); c.fill();
  }
}

function _drawRunWalk(c, x, y, u, skinC, shirtC, char, wp) {
  const ph = wp * Math.PI * 2;
  // Torso (lean forward a bit)
  c.save(); c.translate(x, y + u*.15); c.rotate(.07);
  _drawTorso(c, 0, -u*.13, u, shirtC, char);
  c.restore();

  // Legs alternating
  const lAngle = Math.sin(ph) * .55;
  const rAngle = Math.sin(ph + Math.PI) * .55;
  c.fillStyle = '#222';
  c.save(); c.translate(x - u*.1, y + u*.32); c.rotate(lAngle);
  c.fillRect(-u*.09, 0, u*.17, u*.42); c.restore();
  c.save(); c.translate(x + u*.1, y + u*.32); c.rotate(rAngle);
  c.fillRect(-u*.08, 0, u*.17, u*.42); c.restore();

  // Feet
  c.fillStyle = '#111';
  const lFoot = { x: x - u*.1 + Math.sin(lAngle) * u*.42, y: y + u*.72 };
  const rFoot = { x: x + u*.1 + Math.sin(rAngle) * u*.42, y: y + u*.72 };
  c.beginPath(); c.ellipse(lFoot.x, lFoot.y, u*.16, u*.07, lAngle*.5, 0, Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(rFoot.x, rFoot.y, u*.16, u*.07, rAngle*.5, 0, Math.PI*2); c.fill();

  // Arms swinging opposite
  c.fillStyle = skinC;
  const lArmA = Math.sin(ph + Math.PI) * .6;
  const rArmA = Math.sin(ph) * .6;
  c.save(); c.translate(x - u*.3, y + u*.05); c.rotate(lArmA);
  c.fillRect(-u*.07, 0, u*.14, u*.28); c.restore();
  c.save(); c.translate(x + u*.3, y + u*.05); c.rotate(rArmA);
  c.fillRect(-u*.07, 0, u*.14, u*.28); c.restore();
  // Hands
  c.beginPath(); c.ellipse(x - u*.3 + Math.sin(lArmA) * u*.28, y + u*.3 + Math.cos(lArmA) * u*.05, u*.1, u*.09, lArmA, 0, Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x + u*.3 + Math.sin(rArmA) * u*.28, y + u*.3 + Math.cos(rArmA) * u*.05, u*.1, u*.09, rArmA, 0, Math.PI*2); c.fill();

  // Neck
  c.fillStyle = char.skin;
  c.fillRect(x - u*.07, y - u*.56, u*.14, u*.08);
}

function _drawSit(c, x, y, u, skinC, shirtC, char) {
  const oy = u * .2; // sit offset
  // Torso
  _drawTorso(c, x, y - oy, u, shirtC, char);
  // Upper legs horizontal
  c.fillStyle = '#222';
  c.fillRect(x - u*.3, y - oy + u*.35, u*.28, u*.16);
  c.fillRect(x + u*.02, y - oy + u*.35, u*.28, u*.16);
  // Lower legs hanging down
  c.fillRect(x - u*.22, y - oy + u*.5, u*.18, u*.3);
  c.fillRect(x + u*.04, y - oy + u*.5, u*.18, u*.3);
  // Shoes
  c.fillStyle = '#111';
  c.beginPath(); c.ellipse(x - u*.13, y - oy + u*.82, u*.18, u*.07, 0, 0, Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x + u*.13, y - oy + u*.82, u*.18, u*.07, 0, 0, Math.PI*2); c.fill();
  // Arms resting
  c.fillStyle = skinC;
  c.beginPath(); c.ellipse(x - u*.36, y - oy + u*.4, u*.09, u*.16, .2, 0, Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x + u*.36, y - oy + u*.4, u*.09, u*.16, -.2, 0, Math.PI*2); c.fill();
}

/* ── HEAD ── */
function drawHead(c, x, y, s, char) {
  const u = 80 * s;
  c.fillStyle = char.skin || '#f4a261';
  c.beginPath(); c.ellipse(x, y, u*.36, u*.42, 0, 0, Math.PI*2); c.fill();
  // Ears
  c.beginPath(); c.ellipse(x - u*.35, y + u*.05, u*.08, u*.1, 0, 0, Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x + u*.35, y + u*.05, u*.08, u*.1, 0, 0, Math.PI*2); c.fill();
  // Inner ear
  c.fillStyle = darken(char.skin, 15);
  c.beginPath(); c.ellipse(x - u*.35, y + u*.05, u*.04, u*.055, 0, 0, Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x + u*.35, y + u*.05, u*.04, u*.055, 0, 0, Math.PI*2); c.fill();
  // Nose
  c.fillStyle = darken(char.skin, 20);
  c.beginPath(); c.ellipse(x, y + u*.1, u*.05, u*.04, 0, 0, Math.PI*2); c.fill();
}

/* ── HAIR ── */
function drawHair(c, x, y, s, char, exprId) {
  const u = 80 * s;
  const hc = char.hair || '#1a1a2e';
  c.fillStyle = hc;
  // Base cap
  c.beginPath(); c.ellipse(x, y - u*.1, u*.37, u*.32, 0, Math.PI, 0); c.fill();
  // Side puffs
  c.beginPath(); c.ellipse(x - u*.3, y - u*.02, u*.12, u*.22, -.4, 0, Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x + u*.3, y - u*.02, u*.12, u*.22, .4, 0, Math.PI*2); c.fill();
  // Spiky top
  const spikes = exprId === 'fire' ? 5 : 3;
  for (let i = 0; i < spikes; i++) {
    const ox = (i - (spikes-1)/2) * u * .18;
    c.beginPath();
    c.moveTo(x + ox, y - u*.3);
    c.lineTo(x + ox + u*.08, y - u*.52 - (i % 2 === 0 ? u*.06 : 0));
    c.lineTo(x + ox + u*.17, y - u*.28);
    c.closePath(); c.fill();
  }
  // Fire hair extra
  if (exprId === 'fire') {
    const t = Date.now() / 600;
    c.globalAlpha = .75;
    for (let i = 0; i < 5; i++) {
      const fx = x + (i - 2) * u * .14;
      const fg = c.createLinearGradient(fx, y - u*.3, fx, y - u*.72);
      fg.addColorStop(0, '#ff4500'); fg.addColorStop(.5, '#ff8c00'); fg.addColorStop(1, 'transparent');
      c.fillStyle = fg;
      c.beginPath();
      c.ellipse(fx, y - u * (.42 + Math.sin(t + i) * .08), u*.06, u*.15, Math.sin(t + i) * .2, 0, Math.PI*2);
      c.fill();
    }
    c.globalAlpha = 1;
  }
}

/* ── EXPRESSION (eyes, brows, mouth, extras) ── */
function drawExpression(c, x, y, s, exprId, mouthOverride) {
  const u = 80 * s;
  const ey = y - u * .06;
  const my = y + u * .17;

  const p = EXPR_MAP[exprId] || EXPR_MAP.normal;

  // Eyes
  for (let side of [-1, 1]) {
    const ex = x + side * u * .18;
    if (p.extras.includes('cross')) {
      c.strokeStyle = '#222'; c.lineWidth = s * 6; c.lineCap = 'round';
      c.beginPath(); c.moveTo(ex - u*.08, ey - u*.08); c.lineTo(ex + u*.08, ey + u*.08); c.stroke();
      c.beginPath(); c.moveTo(ex + u*.08, ey - u*.08); c.lineTo(ex - u*.08, ey + u*.08); c.stroke();
    } else if (p.extras.includes('shades')) {
      c.fillStyle = 'rgba(0,0,0,.9)';
      c.beginPath(); c.roundRect(ex - u*.13, ey - u*.07, u*.26, u*.13, u*.03); c.fill();
      c.strokeStyle = '#555'; c.lineWidth = s * 1.5;
      c.beginPath(); c.roundRect(ex - u*.13, ey - u*.07, u*.26, u*.13, u*.03); c.stroke();
      if (side === -1) { c.beginPath(); c.moveTo(ex + u*.13, ey); c.lineTo(ex + u*.31, ey); c.stroke(); }
    } else if (p.extras.includes('hearts_eye')) {
      c.fillStyle = '#ff3c5a'; c.font = `${u*.22}px serif`;
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('❤', ex, ey + u*.02);
    } else {
      // White
      c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, ey, u * p.ew, u * p.eh, 0, 0, Math.PI*2); c.fill();
      // Iris
      const irisC = exprId === 'evil' ? '#cc0000' : '#1a237e';
      c.fillStyle = irisC; c.beginPath(); c.ellipse(ex + u*.015, ey + u*.01, u*p.ew*.6, u*p.eh*.6, 0, 0, Math.PI*2); c.fill();
      // Pupil
      c.fillStyle = '#000'; c.beginPath(); c.ellipse(ex + u*.02, ey + u*.015, u*p.ew*.28, u*p.eh*.28, 0, 0, Math.PI*2); c.fill();
      // Sparkle
      c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex + u*.03, ey - u*.012, u*.022, u*.018, 0, 0, Math.PI*2); c.fill();
      c.globalAlpha = .3; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex - u*.022, ey - u*.02, u*.016, u*.013, 0, 0, Math.PI*2); c.fill(); c.globalAlpha = 1;
    }

    // Eyebrow
    if (!['cross','shades','hearts_eye'].some(e => p.extras.includes(e))) {
      c.strokeStyle = '#1a1a2e'; c.lineWidth = s * 4.5; c.lineCap = 'round';
      const br = p.brow;
      c.beginPath();
      c.moveTo(ex - u*.12, ey - u*(p.eh + .1) + side * u * br);
      c.quadraticCurveTo(ex, ey - u*(p.eh + .13), ex + u*.12, ey - u*(p.eh + .1) - side * u * br);
      c.stroke();
    }
  }

  // Flush / rosy cheeks
  if (p.extras.includes('flush') || p.extras.includes('rosy')) {
    const col = p.extras.includes('flush') ? 'rgba(200,30,30,0.25)' : 'rgba(255,120,120,0.3)';
    c.fillStyle = col;
    c.beginPath(); c.ellipse(x - u*.24, ey + u*.12, u*.12, u*.07, 0, 0, Math.PI*2); c.fill();
    c.beginPath(); c.ellipse(x + u*.24, ey + u*.12, u*.12, u*.07, 0, 0, Math.PI*2); c.fill();
  }

  // Tears
  if (p.extras.includes('tears')) {
    const t = Date.now() / 600;
    c.fillStyle = 'rgba(100,180,255,0.85)';
    for (let side of [-1, 1]) {
      const ex = x + side * u * .18;
      const tearY = ey + u * (.08 + Math.abs(Math.sin(t + side)) * u * .005);
      c.beginPath();
      c.moveTo(ex + side * u * .04, tearY);
      c.quadraticCurveTo(ex + side * u * .08, tearY + u * .08, ex, tearY + u * .14);
      c.quadraticCurveTo(ex - side * u * .08, tearY + u * .08, ex + side * u * .04, tearY);
      c.fill();
    }
  }

  // Sweat
  if (p.extras.includes('sweat')) {
    c.fillStyle = 'rgba(100,180,255,0.8)';
    c.beginPath();
    c.moveTo(x + u*.32, ey - u*.1);
    c.quadraticCurveTo(x + u*.4, ey, x + u*.32, ey + u*.1);
    c.quadraticCurveTo(x + u*.24, ey, x + u*.32, ey - u*.1);
    c.fill();
  }

  // Steam (furious)
  if (p.extras.includes('steam')) {
    const t = Date.now() / 400;
    c.strokeStyle = 'rgba(255,150,50,0.7)'; c.lineWidth = s * 4; c.lineCap = 'round';
    for (let side of [-1, 1]) {
      const sx = x + side * u * .28;
      c.beginPath();
      c.moveTo(sx, ey - u*.12);
      c.quadraticCurveTo(sx + side * u * .08, ey - u*.22, sx, ey - u*.32);
      c.stroke();
    }
  }

  // Mouth
  const mouthId = mouthOverride || p.mouth;
  drawMouth(c, x, my, u, s, mouthId, p);
}

/* ── MOUTH ── */
function drawMouth(c, x, my, u, s, mouthId, p) {
  c.lineCap = 'round';
  switch (mouthId) {
    case 'closed': case 'mm':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.1, my); c.lineTo(x + u*.1, my); c.stroke(); break;
    case 'small':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.07, my); c.quadraticCurveTo(x, my + u*.04, x + u*.07, my); c.stroke(); break;
    case 'smile':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.12, my); c.quadraticCurveTo(x, my + u*.09, x + u*.12, my); c.stroke(); break;
    case 'bigsmile':
      c.fillStyle = '#cc3333';
      c.beginPath(); c.moveTo(x - u*.17, my - u*.02); c.quadraticCurveTo(x, my + u*.16, x + u*.17, my - u*.02); c.fill();
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 2; c.stroke();
      c.fillStyle = '#fff'; c.fillRect(x - u*.11, my, u*.09, u*.05); c.fillRect(x + u*.02, my, u*.09, u*.05); break;
    case 'ee':
      c.fillStyle = '#cc3333';
      c.beginPath(); c.moveTo(x - u*.15, my - u*.01); c.quadraticCurveTo(x, my + u*.08, x + u*.15, my - u*.01); c.fill();
      c.fillStyle = '#fff'; c.fillRect(x - u*.13, my, u*.26, u*.06); break;
    case 'open': case 'oh':
      c.fillStyle = '#111';
      c.beginPath(); c.ellipse(x, my + u*.04, u*.1, u*.12, 0, 0, Math.PI*2); c.fill(); break;
    case 'wide':
      c.fillStyle = '#800';
      c.beginPath(); c.ellipse(x, my + u*.05, u*.18, u*.16, 0, 0, Math.PI*2); c.fill();
      c.fillStyle = '#fff';
      for (let i = 0; i < 3; i++) c.fillRect(x - u*.12 + i * u*.1, my, u*.07, u*.06); break;
    case 'sad':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.12, my + u*.08); c.quadraticCurveTo(x, my - u*.04, x + u*.12, my + u*.08); c.stroke(); break;
    case 'growl':
      c.fillStyle = '#111';
      c.beginPath(); c.moveTo(x - u*.17, my - u*.01); c.lineTo(x + u*.17, my - u*.01); c.lineTo(x + u*.14, my + u*.12); c.lineTo(x - u*.14, my + u*.12); c.closePath(); c.fill();
      c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) c.fillRect(x - u*.14 + i * u*.07 + u*.004, my, u*.055, u*.07); break;
    case 'roar':
      c.fillStyle = '#800';
      c.beginPath(); c.ellipse(x, my + u*.05, u*.18, u*.16, 0, 0, Math.PI*2); c.fill();
      c.fillStyle = '#fff'; for (let i = 0; i < 3; i++) c.fillRect(x - u*.12 + i * u*.1, my, u*.07, u*.06);
      c.fillStyle = '#ff6666'; c.beginPath(); c.ellipse(x, my + u*.16, u*.03, u*.05, 0, 0, Math.PI*2); c.fill(); break;
    case 'ohno':
      c.fillStyle = '#111'; c.beginPath(); c.ellipse(x, my + u*.04, u*.1, u*.13, 0, 0, Math.PI*2); c.fill(); break;
    case 'smirk':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.08, my + u*.03); c.quadraticCurveTo(x + u*.03, my + u*.09, x + u*.14, my - u*.02); c.stroke(); break;
    case 'laugh':
      c.fillStyle = '#111';
      c.beginPath(); c.moveTo(x - u*.16, my - u*.02); c.quadraticCurveTo(x, my + u*.17, x + u*.16, my - u*.02); c.fill();
      c.fillStyle = '#fff'; c.fillRect(x - u*.11, my, u*.08, u*.07); c.fillRect(x + u*.03, my, u*.08, u*.07); break;
    case 'dead':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.12, my + u*.05); c.quadraticCurveTo(x - u*.04, my - u*.04, x, my + u*.05);
      c.quadraticCurveTo(x + u*.04, my + u*.12, x + u*.12, my); c.stroke(); break;
    case 'evil':
      c.strokeStyle = '#900'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.14, my + u*.04); c.quadraticCurveTo(x, my + u*.14, x + u*.14, my + u*.04); c.stroke();
      c.fillStyle = '#fff';
      c.beginPath(); c.moveTo(x - u*.08, my + u*.04); c.lineTo(x - u*.04, my + u*.13); c.lineTo(x - u*.01, my + u*.04); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(x + u*.01, my + u*.04); c.lineTo(x + u*.05, my + u*.13); c.lineTo(x + u*.09, my + u*.04); c.closePath(); c.fill(); break;
    case 'nervous':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 2.5;
      c.beginPath(); c.moveTo(x - u*.1, my); c.lineTo(x - u*.05, my + u*.05); c.lineTo(x, my); c.lineTo(x + u*.05, my + u*.05); c.lineTo(x + u*.1, my); c.stroke(); break;
    case 'wavy':
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 2.5;
      c.beginPath(); c.moveTo(x - u*.12, my + u*.02);
      c.quadraticCurveTo(x - u*.06, my - u*.03, x, my + u*.02);
      c.quadraticCurveTo(x + u*.06, my + u*.07, x + u*.12, my + u*.02); c.stroke(); break;
    default:
      c.strokeStyle = '#a0522d'; c.lineWidth = s * 3;
      c.beginPath(); c.moveTo(x - u*.1, my); c.quadraticCurveTo(x, my + u*.06, x + u*.1, my); c.stroke();
  }
}

/* ── LIP SYNC HELPER ── */
/**
 * Given text and a playback phase (0-1 through speech duration),
 * returns the current mouth shape id for auto lip sync.
 */
function getLipsyncMouth(text, phase) {
  if (!text || text.length === 0) return 'closed';
  const idx = Math.floor(phase * text.length) % text.length;
  const ch = text[idx].toLowerCase();
  return PHONEME_MAP[ch] || 'small';
}

/* ── COLOR UTILITIES ── */
function lighten(hex, pct) {
  try {
    const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
    return `rgb(${Math.min(255,r+pct)},${Math.min(255,g+pct)},${Math.min(255,b+pct)})`;
  } catch(e) { return hex; }
}
function darken(hex, pct) {
  try {
    const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
    return `rgb(${Math.max(0,r-pct)},${Math.max(0,g-pct)},${Math.max(0,b-pct)})`;
  } catch(e) { return hex; }
}
