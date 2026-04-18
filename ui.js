/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — ui.js
   Sidebar panel builders, tab switching,
   event handlers for all UI controls
═══════════════════════════════════════════ */

function buildUI() {
  buildCharGrid();
  buildExprGrid();
  buildBgGrid();
  buildFxGrid();
  buildPoseGrid();
  buildColorPickers();
  buildStageList();
  buildCharLayerList();
  buildTemplateList();
}

// ── TABS ──
function switchTab(name, el) {
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

// ── CHARACTERS ──
function buildCharGrid() {
  const grid = document.getElementById('char-grid');
  if (!grid) return;
  const ac = S.chars[S.activeChar];
  const selId = ac ? ac.charId : 'prash';
  grid.innerHTML = '';
  CHARS.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'char-card' + (ch.id === selId ? ' sel' : '');
    // Check if this char is on stage
    const onStage = S.chars.some(c => c.charId === ch.id);
    card.innerHTML = `
      ${onStage ? '<div class="chip"></div>' : ''}
      <div class="avatar">${ch.emoji}</div>
      <div class="cname">${ch.name}</div>
    `;
    card.onclick = () => {
      if (S.chars[S.activeChar]) S.chars[S.activeChar].charId = ch.id;
      // Also update colors to char defaults if unchanged
      const ac = S.chars[S.activeChar];
      if (ac && ac.skinColor === '#f4a261') ac.skinColor = ch.skin;
      if (ac && ac.shirtColor === '#e63946') ac.shirtColor = ch.shirt;
      if (ac && ac.hairColor === '#1a1a2e') ac.hairColor = ch.hair;
      buildCharGrid(); buildColorPickers();
      redraw();
    };
    grid.appendChild(card);
  });
}

function buildStageList() {
  const list = document.getElementById('stage-char-list');
  if (!list) return;
  list.innerHTML = '';
  S.chars.forEach((ch, i) => {
    const def = CHARS.find(c => c.id === ch.charId) || CHARS[0];
    const item = document.createElement('div');
    item.className = 'stage-char-item' + (i === S.activeChar ? ' active' : '');
    item.innerHTML = `
      <span class="sci-emoji">${def.emoji}</span>
      <span class="sci-name">${def.name}</span>
      <span class="sci-pos">x:${Math.round(ch.charX)} y:${Math.round(ch.charY)}</span>
    `;
    item.onclick = () => setActiveChar(i);
    list.appendChild(item);
  });
}

function buildCharLayerList() {
  const list = document.getElementById('char-layer-list');
  if (!list) return;
  list.innerHTML = '';
  S.chars.forEach((ch, i) => {
    const def = CHARS.find(c => c.id === ch.charId) || CHARS[0];
    const item = document.createElement('div');
    item.className = 'char-layer-item' + (i === S.activeChar ? ' sel' : '');
    item.innerHTML = `
      <span style="font-size:1rem">${def.emoji}</span>
      <span style="flex:1;font-weight:600">${def.name}</span>
      <span style="font-size:.55rem;color:var(--text-3);background:var(--surface-3);padding:1px 5px;border-radius:4px">${ch.exprId}</span>
    `;
    item.onclick = () => setActiveChar(i);
    list.appendChild(item);
  });
}

// ── EXPRESSIONS ──
function buildExprGrid() {
  const grid = document.getElementById('expr-grid');
  if (!grid) return;
  const ac = S.chars[S.activeChar];
  const selId = ac ? ac.exprId : 'angry';
  grid.innerHTML = '';
  EXPRESSIONS.forEach(ex => {
    const btn = document.createElement('div');
    btn.className = 'expr-btn' + (ex.id === selId ? ' sel' : '');
    btn.innerHTML = `${ex.emoji}<span class="elabel">${ex.name}</span>`;
    btn.onclick = () => {
      if (S.chars[S.activeChar]) S.chars[S.activeChar].exprId = ex.id;
      buildExprGrid(); redraw();
    };
    grid.appendChild(btn);
  });
}

// ── POSES ──
function buildPoseGrid() {
  const grid = document.getElementById('pose-grid');
  if (!grid) return;
  const ac = S.chars[S.activeChar];
  const selId = ac ? (ac.pose || 'stand') : 'stand';
  grid.innerHTML = '';
  POSES.forEach(p => {
    const btn = document.createElement('div');
    btn.className = 'expr-btn' + (p.id === selId ? ' sel' : '');
    btn.innerHTML = `${p.emoji}<span class="elabel">${p.name}</span>`;
    btn.onclick = () => {
      if (S.chars[S.activeChar]) S.chars[S.activeChar].pose = p.id;
      buildPoseGrid(); redraw();
    };
    grid.appendChild(btn);
  });
}

// ── BACKGROUNDS ──
function buildBgGrid() {
  const grid = document.getElementById('bg-grid');
  if (!grid) return;
  grid.innerHTML = '';
  BACKGROUNDS.forEach((bg, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-card' + (bg.id === S.bgId ? ' sel' : '');
    card.style.background = BG_COLORS[idx % BG_COLORS.length];
    card.innerHTML = `<span>${bg.name}</span>`;
    card.onclick = () => { S.bgId = bg.id; buildBgGrid(); redraw(); };
    grid.appendChild(card);
  });
}

// ── EFFECTS ──
function buildFxGrid() {
  const fxGrid = document.getElementById('fx-grid');
  const soundGrid = document.getElementById('sound-grid');
  if (!fxGrid || !soundGrid) return;
  fxGrid.innerHTML = ''; soundGrid.innerHTML = '';

  EFFECTS.forEach(fx => {
    const card = document.createElement('div');
    card.className = 'fx-card' + (S.effects.includes(fx.id) ? ' sel' : '');
    card.innerHTML = fx.name;
    card.onclick = () => {
      if (S.effects.includes(fx.id)) S.effects = S.effects.filter(e => e !== fx.id);
      else S.effects.push(fx.id);
      buildFxGrid(); redraw();
    };
    fxGrid.appendChild(card);
  });

  SOUND_TAGS.forEach(st => {
    const card = document.createElement('div');
    card.className = 'fx-card' + ((S.soundTags||[]).includes(st.id) ? ' sel' : '');
    card.innerHTML = st.name;
    card.onclick = () => {
      if (!S.soundTags) S.soundTags = [];
      if (S.soundTags.includes(st.id)) S.soundTags = S.soundTags.filter(e => e !== st.id);
      else S.soundTags.push(st.id);
      buildFxGrid(); redraw();
    };
    soundGrid.appendChild(card);
  });
}

// ── COLOR PICKERS ──
function buildColorPickers() {
  const ac = S.chars[S.activeChar];

  const skinRow = document.getElementById('skin-row');
  const shirtRow = document.getElementById('shirt-row');
  const hairRow = document.getElementById('hair-row');

  if (!skinRow || !ac) return;
  skinRow.innerHTML = ''; shirtRow.innerHTML = ''; hairRow.innerHTML = '';

  SKIN_TONES.forEach(col => {
    const dot = document.createElement('div');
    dot.className = 'color-dot' + (ac.skinColor === col ? ' sel' : '');
    dot.style.background = col;
    dot.onclick = () => { ac.skinColor = col; buildColorPickers(); redraw(); };
    skinRow.appendChild(dot);
  });
  SHIRT_COLORS.forEach(col => {
    const dot = document.createElement('div');
    dot.className = 'color-dot' + (ac.shirtColor === col ? ' sel' : '');
    dot.style.background = col;
    dot.onclick = () => { ac.shirtColor = col; buildColorPickers(); redraw(); };
    shirtRow.appendChild(dot);
  });
  HAIR_COLORS.forEach(col => {
    const dot = document.createElement('div');
    dot.className = 'color-dot' + (ac.hairColor === col ? ' sel' : '');
    dot.style.background = col || '#ffffff';
    dot.style.border = col === '#fff' || col === '#ffffff' ? '2px solid #555' : '';
    dot.onclick = () => { ac.hairColor = col; buildColorPickers(); redraw(); };
    hairRow.appendChild(dot);
  });
}

// ── DIALOGUE / BUBBLE ──
function setBubble(type, btn) {
  const ac = S.chars[S.activeChar];
  if (ac) ac.bubbleType = type;
  document.querySelectorAll('.bub-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  redraw();
}

function refreshBubbleButtons() {
  const ac = S.chars[S.activeChar];
  const type = ac ? ac.bubbleType : 'speech';
  document.querySelectorAll('.bub-btn').forEach(btn => {
    const map = { speech:'Speech', angry:'💢 Angry', thought:'💭', shout:'📢', caption:'📺 Sub', none:'Off' };
    const matches = Object.entries(map).find(([k,v]) => k === type && btn.textContent.trim() === v);
    btn.classList.toggle('sel', !!matches);
  });
}

function toggleTextStyle(style, btn) {
  const ac = S.chars[S.activeChar];
  if (!ac) return;
  if (style === 'bold') ac.textBold = !ac.textBold;
  else if (style === 'italic') ac.textItalic = !ac.textItalic;
  else if (style === 'caps') ac.textCaps = !ac.textCaps;
  btn.classList.toggle('on');
  redraw();
}

// ── TEMPLATES ──
function buildTemplateList() {
  const list = document.getElementById('template-list');
  if (!list) return;
  list.innerHTML = '';
  TEMPLATES.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = 'tmpl-card';
    card.innerHTML = `
      <div class="tmpl-icon">${t.icon}</div>
      <div class="tmpl-info">
        <div class="tmpl-name">${t.name}</div>
        <div class="tmpl-desc">${t.desc}</div>
      </div>
      <button class="tmpl-load" onclick="loadTemplate(${idx});closeModal('templates-modal')">Load</button>
    `;
    list.appendChild(card);
  });
}

// ── ZOOM / TOOLS ──
function setTool(t, btn) {
  tool = t;
  document.querySelectorAll('.ctool-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  canvas.style.cursor = t === 'move' ? 'grab' : 'default';
}

function zoomIn()  { zoomLevel = Math.min(3, zoomLevel + 0.25); fitCanvas(); document.getElementById('zoom-label').textContent = Math.round(zoomLevel*100)+'%'; }
function zoomOut() { zoomLevel = Math.max(0.25, zoomLevel - 0.25); fitCanvas(); document.getElementById('zoom-label').textContent = Math.round(zoomLevel*100)+'%'; }
function resetZoom() { zoomLevel = 1; fitCanvas(); document.getElementById('zoom-label').textContent = '100%'; }

function toggleOnionSkin(btn) {
  showOnion = !showOnion;
  btn.classList.toggle('active', showOnion);
  onionCanvas.style.opacity = showOnion ? '0.3' : '0';
  if (showOnion && currentFrame > 0) renderOnion();
  else onionCtx.clearRect(0,0,W,H);
}

function toggleGrid(btn) { showGrid = !showGrid; btn.classList.toggle('active', showGrid); redraw(); }

function toggleSafeZone(btn) {
  btn.classList.toggle('active');
  document.getElementById('safe-overlay').style.display = btn.classList.contains('active') ? 'block' : 'none';
}

// ── MODALS & MISC ──
function showTemplates() { document.getElementById('templates-modal').style.display = 'flex'; }
function openExport()    { document.getElementById('export-modal').style.display = 'flex'; }
function closeModal(id)  { document.getElementById(id).style.display = 'none'; }

function selectExport(mode, el) {
  exportMode = mode;
  document.querySelectorAll('.export-option').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
}

function toast(msg, type) {
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' '+type : '');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function changeFPS(v) {
  fps = +v;
  document.getElementById('fps-indicator').textContent = fps + ' FPS · ' + totalDuration();
  updateTimecodeLabel();
}
