/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — engine.js
   Main render loop, state management,
   multi-character scene rendering,
   walk animation, lip sync engine
═══════════════════════════════════════════ */

// ── CANVAS & STATE ──
let canvas, ctx, onionCanvas, onionCtx;
const W = 1280, H = 720;

// Current frame state
let S = {
  chars: [
    {
      charId: 'prash', exprId: 'angry', pose: 'stand',
      charX: 45, charY: 58, charScale: 1, flip: false, rotation: 0,
      skinColor: '#f4a261', shirtColor: '#e63946', hairColor: '#1a1a2e',
      dialogue: '', bubbleType: 'speech',
      textBold: false, textItalic: false, textCaps: false,
      textColor: '#111111', fontSize: 14,
      walkDir: 'none', walkSpeed: 4,
      lipsync: 'auto', mouthOverride: null,
    }
  ],
  bgId: 'classroom',
  effects: [],
  soundTags: [],
  holdFrames: 4,
  activeChar: 0,
};

let frames = [];
let currentFrame = -1;
let isPlaying = false;
let playInterval = null;
let fps = 24;
let looping = true;
let zoomLevel = 1;
let tool = 'select';
let showOnion = false;
let showGrid = false;
let exportMode = 'gif';
let undoStack = [], redoStack = [];

// Walk animation clock (per-char)
let walkPhases = {};     // charId+index → phase 0-1
let animFrame = null;
let lastTime = 0;
let lipsyncPhase = 0;   // global lip sync phase
let newCharTemplate = null;

// ── INIT ──
window.onload = () => {
  canvas = document.getElementById('scene-canvas');
  ctx = canvas.getContext('2d');
  onionCanvas = document.getElementById('onion-canvas');
  onionCtx = onionCanvas.getContext('2d');

  canvas.width = W; canvas.height = H;
  onionCanvas.width = W; onionCanvas.height = H;

  fitCanvas();
  window.addEventListener('resize', fitCanvas);

  buildUI();
  redraw();
  startAnimLoop();

  // Keyboard shortcuts
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'ArrowLeft')  { e.preventDefault(); prevFrame(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); nextFrame(); }
    else if (e.key === 'a' || e.key === 'A') addFrame();
    else if (e.key === 'd' || e.key === 'D') duplicateFrame();
    else if (e.key === 'Delete' || e.key === 'Backspace') removeCurrentFrame();
    else if ((e.ctrlKey||e.metaKey) && e.key === 'z') undo();
    else if ((e.ctrlKey||e.metaKey) && e.key === 'y') redo();
  });

  // Canvas click for character selection
  canvas.addEventListener('click', onCanvasClick);
  canvas.addEventListener('mousemove', onCanvasHover);
};

// ── ANIMATION LOOP ──
function startAnimLoop() {
  function loop(ts) {
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;

    // Advance walk phases
    S.chars.forEach((ch, i) => {
      if (!ch.walkDir || ch.walkDir === 'none') return;
      const key = i;
      walkPhases[key] = ((walkPhases[key] || 0) + dt * ch.walkSpeed * 0.5) % 1;
    });

    // Advance lip sync
    lipsyncPhase = (lipsyncPhase + dt * 8) % 1;

    // Redraw if any walk/effects active
    const needsAnim = S.chars.some(ch => ch.walkDir && ch.walkDir !== 'none') ||
                      S.effects.length > 0 || (isPlaying && frames.length > 0);
    if (needsAnim) redraw();

    animFrame = requestAnimationFrame(loop);
  }
  animFrame = requestAnimationFrame(loop);
}

// ── CANVAS FIT ──
function fitCanvas() {
  const outer = document.getElementById('scene-outer');
  const ow = outer.clientWidth - 32;
  const oh = outer.clientHeight - 32;
  const scale = Math.min(zoomLevel, ow/W, oh/H);
  canvas.style.width  = onionCanvas.style.width  = Math.round(W * scale) + 'px';
  canvas.style.height = onionCanvas.style.height = Math.round(H * scale) + 'px';
}

// ── MAIN REDRAW ──
function redraw(targetCtx, targetW, targetH, overrideState) {
  const c = targetCtx || ctx;
  const w = targetW || W;
  const h = targetH || H;
  const state = overrideState || S;

  c.clearRect(0, 0, w, h);

  // Background
  drawBackground(c, w, h, state.bgId);

  // Grid overlay
  if (showGrid && !targetCtx) {
    c.save(); c.strokeStyle = 'rgba(255,255,255,0.05)'; c.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      c.beginPath(); c.moveTo(i*w/10, 0); c.lineTo(i*w/10, h); c.stroke();
      c.beginPath(); c.moveTo(0, i*h/10); c.lineTo(w, i*h/10); c.stroke();
    }
    c.restore();
  }

  // FX behind characters
  drawFXBehind(c, w, h, state.effects || []);

  // ── DRAW ALL CHARACTERS ──
  const chars = state.chars || [];
  chars.forEach((ch, i) => {
    const charDef = { ...(CHARS.find(cd => cd.id === ch.charId) || CHARS[0]), skin: ch.skinColor || '#f4a261', hair: ch.hairColor || '#111', shirt: ch.shirtColor || '#e63946' };
    const scale = ch.charScale * (w / 900);
    const cx = (ch.charX / 100) * w;
    const cy = (ch.charY / 100) * h;
    const wp = walkPhases[i] || 0;

    // Lip sync mouth
    let mouthOverride = null;
    if (ch.lipsync === 'manual') {
      mouthOverride = ch.mouthOverride;
    } else if (ch.lipsync === 'auto' && ch.dialogue) {
      mouthOverride = getLipsyncMouth(ch.dialogue, lipsyncPhase);
    }

    c.save();
    c.translate(cx, cy);
    c.rotate((ch.rotation || 0) * Math.PI / 180);
    if (ch.flip) c.scale(-1, 1);
    drawCharacter(c, 0, 0, scale, charDef, ch.exprId, ch.pose || 'stand', wp, mouthOverride);
    c.restore();

    // Dialogue bubble for this char
    if (ch.dialogue && ch.bubbleType !== 'none') {
      drawDialogue(c, ch.dialogue, ch.bubbleType, cx, cy, scale, w, h, ch);
    }

    // Active char highlight (edit mode only)
    if (!targetCtx && !isPlaying && i === state.activeChar) {
      c.save();
      c.strokeStyle = 'rgba(0,212,255,0.6)';
      c.lineWidth = 2;
      c.setLineDash([6, 4]);
      const u = 80 * scale;
      c.strokeRect(cx - u*.5, cy - u*.9, u*1.0, u*1.85);
      c.setLineDash([]);
      c.restore();
    }
  });

  // FX over characters
  drawFXFront(c, w, h, state.effects || [], state.soundTags || []);
}

// ── CANVAS INTERACTION ──
function onCanvasClick(e) {
  if (tool !== 'select' && tool !== 'move') return;
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (W / rect.width);
  const my = (e.clientY - rect.top) * (H / rect.height);

  // Check which char was clicked
  for (let i = S.chars.length - 1; i >= 0; i--) {
    const ch = S.chars[i];
    const scale = ch.charScale * (W / 900);
    const u = 80 * scale;
    const cx = (ch.charX / 100) * W;
    const cy = (ch.charY / 100) * H;
    if (mx > cx - u*.55 && mx < cx + u*.55 && my > cy - u * .92 && my < cy + u * .95) {
      setActiveChar(i);
      return;
    }
  }
}

let _dragChar = null, _dragStartX = 0, _dragStartY = 0, _charStartX = 0, _charStartY = 0;

function onCanvasHover(e) {
  if (tool !== 'move') return;
  // Could add drag-to-move here
}

canvas && canvas.addEventListener('mousedown', e => {
  if (tool !== 'move') return;
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (W / rect.width);
  const my = (e.clientY - rect.top) * (H / rect.height);
  // Find char under cursor
  for (let i = S.chars.length - 1; i >= 0; i--) {
    const ch = S.chars[i];
    const scale = ch.charScale * (W / 900);
    const u = 80 * scale;
    const cx = (ch.charX / 100) * W;
    const cy = (ch.charY / 100) * H;
    if (mx > cx - u*.6 && mx < cx + u*.6 && my > cy - u * .95 && my < cy + u) {
      _dragChar = i;
      _dragStartX = e.clientX; _dragStartY = e.clientY;
      _charStartX = ch.charX;  _charStartY = ch.charY;
      break;
    }
  }
});

window.addEventListener('mousemove', e => {
  if (_dragChar === null || tool !== 'move') return;
  const rect = canvas.getBoundingClientRect();
  const dx = (e.clientX - _dragStartX) / rect.width * 100;
  const dy = (e.clientY - _dragStartY) / rect.height * 100;
  S.chars[_dragChar].charX = Math.max(5, Math.min(95, _charStartX + dx));
  S.chars[_dragChar].charY = Math.max(20, Math.min(90, _charStartY + dy));
  updateSliders();
  redraw();
});

window.addEventListener('mouseup', () => { _dragChar = null; });

// ── PROP UPDATES ──
function updateProp(key, value) {
  const ac = S.activeChar;
  if (ac >= 0 && ac < S.chars.length) {
    S.chars[ac][key] = value;
  }
  redraw();
}

function updateSliders() {
  const ac = S.activeChar;
  const ch = S.chars[ac];
  if (!ch) return;
  const px = document.getElementById('px'), py = document.getElementById('py');
  if (px) { px.value = Math.round(ch.charX); document.getElementById('px-val').textContent = Math.round(ch.charX); }
  if (py) { py.value = Math.round(ch.charY); document.getElementById('py-val').textContent = Math.round(ch.charY); }
}

function resetTransform() {
  const ch = S.chars[S.activeChar];
  if (!ch) return;
  ch.charX = 45; ch.charY = 58; ch.charScale = 1; ch.flip = false; ch.rotation = 0;
  document.getElementById('px').value = 45; document.getElementById('px-val').textContent = '45';
  document.getElementById('py').value = 58; document.getElementById('py-val').textContent = '58';
  document.getElementById('pscale').value = 100; document.getElementById('pscale-val').textContent = '1.0';
  document.getElementById('prot').value = 0; document.getElementById('prot-val').textContent = '0°';
  redraw();
}

// ── CAPTURE / APPLY STATE ──
function captureFrameState() {
  const ac = S.chars[S.activeChar];
  return JSON.parse(JSON.stringify({
    chars: S.chars.map((ch, i) => ({
      ...ch,
      dialogue: i === S.activeChar ? (document.getElementById('dialogue-text').value || '') : ch.dialogue,
      fontSize: i === S.activeChar ? (+document.getElementById('font-size-input').value || 14) : ch.fontSize,
      textColor: i === S.activeChar ? (document.getElementById('text-color').value || '#111111') : ch.textColor,
    })),
    bgId: S.bgId,
    effects: [...S.effects],
    soundTags: [...(S.soundTags||[])],
    holdFrames: +document.getElementById('phold').value || 4,
    activeChar: S.activeChar,
  }));
}

function applyState(st) {
  S.chars = JSON.parse(JSON.stringify(st.chars || [S.chars[0]]));
  S.bgId = st.bgId || 'classroom';
  S.effects = [...(st.effects || [])];
  S.soundTags = [...(st.soundTags || [])];
  S.activeChar = Math.min(st.activeChar || 0, S.chars.length - 1);

  const ac = S.chars[S.activeChar];
  if (ac) {
    document.getElementById('dialogue-text').value = ac.dialogue || '';
    document.getElementById('px').value = ac.charX || 45;      document.getElementById('px-val').textContent = Math.round(ac.charX||45);
    document.getElementById('py').value = ac.charY || 58;      document.getElementById('py-val').textContent = Math.round(ac.charY||58);
    document.getElementById('pscale').value = Math.round((ac.charScale||1)*100); document.getElementById('pscale-val').textContent = (ac.charScale||1).toFixed(1);
    document.getElementById('prot').value = ac.rotation || 0;  document.getElementById('prot-val').textContent = (ac.rotation||0)+'°';
    document.getElementById('phold').value = st.holdFrames || 4; document.getElementById('phold-val').textContent = (st.holdFrames||4)+'f';
    document.getElementById('font-size-input').value = ac.fontSize || 14;
    document.getElementById('text-color').value = ac.textColor || '#111111';
    syncDialogueBadge();
  }

  buildCharGrid(); buildExprGrid(); buildBgGrid(); buildFxGrid(); buildPoseGrid();
  buildColorPickers(); refreshBubbleButtons(); buildCharLayerList(); buildStageList();
  updateLayersProps(st);
  redraw();
}

function syncDialogue() {
  const ac = S.chars[S.activeChar];
  if (ac) ac.dialogue = document.getElementById('dialogue-text').value;
  redraw();
}

function syncDialogueBadge() {
  const badge = document.getElementById('active-char-badge');
  const ac = S.chars[S.activeChar];
  if (ac && S.chars.length > 1) {
    badge.style.display = 'block';
    badge.textContent = `Speaking: ${CHARS.find(c=>c.id===ac.charId)?.name || ac.charId}`;
  } else {
    badge.style.display = 'none';
  }
}

// ── MULTI-CHARACTER ──
function setActiveChar(idx) {
  S.activeChar = idx;
  const ch = S.chars[idx];
  if (!ch) return;
  document.getElementById('dialogue-text').value = ch.dialogue || '';
  document.getElementById('font-size-input').value = ch.fontSize || 14;
  document.getElementById('text-color').value = ch.textColor || '#111111';
  document.getElementById('px').value = Math.round(ch.charX || 45);     document.getElementById('px-val').textContent = Math.round(ch.charX||45);
  document.getElementById('py').value = Math.round(ch.charY || 58);     document.getElementById('py-val').textContent = Math.round(ch.charY||58);
  document.getElementById('pscale').value = Math.round((ch.charScale||1)*100); document.getElementById('pscale-val').textContent = (ch.charScale||1).toFixed(1);
  document.getElementById('prot').value = ch.rotation || 0;              document.getElementById('prot-val').textContent = (ch.rotation||0)+'°';
  buildCharGrid(); buildExprGrid(); buildColorPickers(); buildCharLayerList(); buildStageList();
  refreshBubbleButtons(); syncDialogueBadge();
  redraw();
}

function addCharToScene() {
  // Build the add-char modal grid
  const grid = document.getElementById('addchar-grid');
  grid.innerHTML = '';
  newCharTemplate = { charId: CHARS[1].id };
  CHARS.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'char-card' + (ch.id === newCharTemplate.charId ? ' sel' : '');
    card.innerHTML = `<div class="avatar">${ch.emoji}</div><div class="cname">${ch.name}</div>`;
    card.onclick = () => {
      newCharTemplate.charId = ch.id;
      grid.querySelectorAll('.char-card').forEach(c => c.classList.remove('sel'));
      card.classList.add('sel');
    };
    grid.appendChild(card);
  });
  const xSlider = document.getElementById('newchar-x');
  xSlider.oninput = () => { document.getElementById('newchar-x-val').textContent = xSlider.value; };
  document.getElementById('addchar-modal').style.display = 'flex';
}

function confirmAddChar() {
  if (!newCharTemplate) return;
  const charDef = CHARS.find(c => c.id === newCharTemplate.charId) || CHARS[0];
  const xPos = +document.getElementById('newchar-x').value || 65;
  const newChar = {
    charId: charDef.id, exprId: 'normal', pose: 'stand',
    charX: xPos, charY: 58, charScale: 1, flip: xPos > 50,
    rotation: 0,
    skinColor: charDef.skin, shirtColor: charDef.shirt, hairColor: charDef.hair,
    dialogue: '', bubbleType: 'speech',
    textBold: false, textItalic: false, textCaps: false,
    textColor: '#111111', fontSize: 14,
    walkDir: 'none', walkSpeed: 4,
    lipsync: 'auto', mouthOverride: null,
  };
  pushUndo();
  S.chars.push(newChar);
  S.activeChar = S.chars.length - 1;
  closeModal('addchar-modal');
  setActiveChar(S.activeChar);
  toast('Character added!', 'success');
}

function removeActiveChar() {
  if (S.chars.length <= 1) { toast('Need at least 1 character', 'error'); return; }
  pushUndo();
  S.chars.splice(S.activeChar, 1);
  S.activeChar = Math.max(0, S.activeChar - 1);
  setActiveChar(S.activeChar);
  toast('Character removed', '');
}

// ── WALK ANIMATION ──
function setWalk(dir, btn) {
  const ch = S.chars[S.activeChar];
  if (!ch) return;
  ch.walkDir = dir;
  document.querySelectorAll('#tab-anim .mini-btn').forEach(b => b.classList.remove('active-mini'));
  btn.classList.add('active-mini');
  if (dir !== 'none') {
    ch.pose = 'run';
    ch.flip = dir === 'left';
    buildExprGrid();
  }
  redraw();
}

// ── LIP SYNC ──
function setLipsync(mode, btn) {
  const ch = S.chars[S.activeChar];
  if (!ch) return;
  ch.lipsync = mode;
  document.querySelectorAll('#tab-expr .mini-btn').forEach(b => b.classList.remove('active-mini'));
  btn.classList.add('active-mini');
  const manualRow = document.getElementById('manual-mouth-row');
  if (manualRow) manualRow.style.display = mode === 'manual' ? 'block' : 'none';
  if (mode === 'manual') buildMouthGrid();
  redraw();
}

function buildMouthGrid() {
  const grid = document.getElementById('mouth-grid');
  if (!grid) return;
  const ch = S.chars[S.activeChar];
  grid.innerHTML = '';
  MOUTH_SHAPES.forEach(m => {
    const btn = document.createElement('div');
    btn.className = 'expr-btn' + (ch?.mouthOverride === m.id ? ' sel' : '');
    btn.innerHTML = `${m.emoji}<span class="elabel">${m.name}</span>`;
    btn.onclick = () => {
      if (!ch) return;
      ch.mouthOverride = m.id;
      grid.querySelectorAll('.expr-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      redraw();
    };
    grid.appendChild(btn);
  });
}

// ── ONION SKIN ──
function renderOnion() {
  if (!showOnion || currentFrame <= 0) { onionCtx.clearRect(0,0,W,H); return; }
  onionCtx.clearRect(0,0,W,H);
  redraw(onionCtx, W, H, frames[currentFrame-1]);
}

// ── MINI PREVIEW ──
function renderMiniPreview(miniCtx, fr) {
  if (!fr) return;
  redraw(miniCtx, 80, 46, fr);
}

// ── LAYER PROPS ──
function updateLayersProps(st) {
  const inner = document.getElementById('frame-props-inner');
  if (!st || !inner) return;
  const ch = st.chars?.[st.activeChar||0];
  inner.innerHTML = `
    <div class="fp-row"><span class="fp-label">Background</span><span class="fp-value">${st.bgId}</span></div>
    <div class="fp-row"><span class="fp-label">Characters</span><span class="fp-value">${st.chars?.length||1}</span></div>
    <div class="fp-row"><span class="fp-label">Hold frames</span><span class="fp-value">${st.holdFrames||4}f</span></div>
    <div class="fp-row"><span class="fp-label">Effects</span><span class="fp-value">${(st.effects||[]).length}</span></div>
    ${ch ? `<div class="fp-row"><span class="fp-label">Active char</span><span class="fp-value">${ch.charId}</span></div>` : ''}
    ${ch ? `<div class="fp-row"><span class="fp-label">Expression</span><span class="fp-value">${ch.exprId}</span></div>` : ''}
    ${ch ? `<div class="fp-row"><span class="fp-label">Lip sync</span><span class="fp-value">${ch.lipsync||'auto'}</span></div>` : ''}
  `;
}
