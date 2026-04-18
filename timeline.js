/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — timeline.js
   Timeline strip, playback, frame management
═══════════════════════════════════════════ */

const CELL_W = 80, CELL_GAP = 4, LEFT = 80;

// ── FRAME MANAGEMENT ──
function addFrame() {
  pushUndo();
  const st = captureFrameState();
  frames.push(st);
  currentFrame = frames.length - 1;
  buildTimeline();
  updateTimecodeLabel();
  toast('Frame #' + frames.length + ' added', 'success');
}

function duplicateFrame() {
  if (currentFrame < 0) { addFrame(); return; }
  pushUndo();
  const copy = JSON.parse(JSON.stringify(frames[currentFrame]));
  frames.splice(currentFrame + 1, 0, copy);
  currentFrame++;
  buildTimeline(); updateTimecodeLabel();
  toast('Frame duplicated', 'success');
}

function removeCurrentFrame() {
  if (currentFrame < 0 || !frames.length) return;
  pushUndo();
  frames.splice(currentFrame, 1);
  if (currentFrame >= frames.length) currentFrame = frames.length - 1;
  buildTimeline(); updateTimecodeLabel();
  if (currentFrame >= 0 && frames.length) applyState(frames[currentFrame]);
  else redraw();
}

function clearFrame() {
  if (currentFrame < 0 || !frames.length) return;
  pushUndo();
  const fr = frames[currentFrame];
  fr.chars.forEach(ch => { ch.dialogue = ''; ch.effects = []; });
  fr.effects = [];
  fr.soundTags = [];
  buildTimeline(); applyState(fr);
  toast('Frame cleared', '');
}

function gotoFrame(i) {
  if (!frames.length) return;
  i = Math.max(0, Math.min(frames.length - 1, i));
  currentFrame = i;
  applyState(frames[i]);
  highlightFrame(i);
  updateTimecode(i);
  if (showOnion) renderOnion();
}

function prevFrame() { if (frames.length) gotoFrame(currentFrame - 1); }
function nextFrame() { if (frames.length) gotoFrame(currentFrame + 1); }

// ── PLAYBACK ──
let _playFrameIdx = 0, _holdCounter = 0;

function togglePlay() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('btn-play');
  if (isPlaying) {
    btn.textContent = '⏸'; btn.classList.add('play-active');
    if (!frames.length) { isPlaying = false; btn.textContent = '▶'; btn.classList.remove('play-active'); return; }
    _playFrameIdx = currentFrame >= 0 ? currentFrame : 0;
    _holdCounter = 0;
    playInterval = setInterval(playTick, 1000 / fps);
  } else {
    btn.textContent = '▶'; btn.classList.remove('play-active');
    clearInterval(playInterval);
  }
}

function playTick() {
  if (!frames.length) { togglePlay(); return; }
  const hold = frames[_playFrameIdx]?.holdFrames || 4;
  applyState(frames[_playFrameIdx]);
  highlightFrame(_playFrameIdx);
  updateTimecode(_playFrameIdx);
  _holdCounter++;
  if (_holdCounter >= hold) {
    _holdCounter = 0;
    _playFrameIdx++;
    if (_playFrameIdx >= frames.length) {
      if (looping) _playFrameIdx = 0;
      else { togglePlay(); return; }
    }
  }
  currentFrame = _playFrameIdx;
}

function toggleLoop(btn) {
  looping = !looping;
  btn.classList.toggle('active', looping);
  btn.style.color = looping ? 'var(--green)' : '';
}

// ── TIMELINE UI ──
function buildTimeline() {
  const mc  = document.getElementById('track-main-content');
  const tc  = document.getElementById('track-text-content');
  const fxc = document.getElementById('track-fx-content');
  mc.innerHTML = ''; tc.innerHTML = ''; fxc.innerHTML = '';

  const totalHold = frames.reduce((a, f) => a + (f.holdFrames || 4), 0);
  const totalPx = totalHold * (CELL_W + CELL_GAP) / 4 + 200;
  [mc, tc, fxc].forEach(el => { el.style.position = 'relative'; el.style.width = totalPx + 'px'; });

  buildRuler(totalPx);

  let px = 0;
  frames.forEach((fr, i) => {
    const hold = fr.holdFrames || 4;
    const cellW = Math.max(40, hold * (CELL_W + CELL_GAP) / 4);

    // Main track cell
    const cell = document.createElement('div');
    cell.className = 'frame-cell' + (i === currentFrame ? ' sel' : '');
    cell.dataset.idx = i;
    cell.style.left = px + 'px';
    cell.style.width = (cellW - CELL_GAP) + 'px';
    cell.style.background = BG_COLORS[BACKGROUNDS.findIndex(b => b.id === fr.bgId) % BG_COLORS.length] || 'var(--surface-3)';

    // Mini preview canvas
    const mini = document.createElement('canvas');
    mini.width = 80; mini.height = 46;
    mini.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    cell.appendChild(mini);
    setTimeout(() => renderMiniPreview(mini.getContext('2d'), fr), 0);

    // Labels
    const num = document.createElement('div'); num.className = 'fcnum';
    num.textContent = '#' + (i + 1) + (fr.chars?.length > 1 ? ' ×'+fr.chars.length : '');
    cell.appendChild(num);

    const del = document.createElement('button'); del.className = 'fcdel'; del.textContent = '✕';
    del.onclick = (e) => {
      e.stopPropagation();
      pushUndo(); frames.splice(i, 1);
      if (currentFrame >= frames.length) currentFrame = frames.length - 1;
      buildTimeline(); updateTimecodeLabel();
    };
    cell.appendChild(del);
    cell.onclick = () => gotoFrame(i);
    mc.appendChild(cell);

    // Text track
    const hasDialogue = fr.chars?.some(ch => ch.dialogue);
    if (hasDialogue) {
      const tc2 = document.createElement('div');
      tc2.className = 'frame-cell';
      tc2.style.cssText = `left:${px}px;width:${cellW-CELL_GAP}px;background:rgba(0,212,255,0.15);border-color:rgba(0,212,255,0.4);font-size:.5rem;color:var(--cyan);padding:2px 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
      tc2.textContent = fr.chars.find(c=>c.dialogue)?.dialogue?.slice(0,28) + '…' || '';
      tc.appendChild(tc2);
    }

    // FX track
    if (fr.effects?.length) {
      const fxEl = document.createElement('div');
      fxEl.className = 'frame-cell';
      fxEl.style.cssText = `left:${px}px;width:${cellW-CELL_GAP}px;background:rgba(155,89,245,0.15);border-color:rgba(155,89,245,0.4);font-size:.55rem;color:var(--purple);padding:2px 4px;`;
      fxEl.textContent = fr.effects.slice(0,3).join(', ');
      fxc.appendChild(fxEl);
    }

    px += cellW;
  });

  // Ghost add cell
  const ghost = document.createElement('div');
  ghost.style.cssText = `position:absolute;left:${px}px;top:4px;width:${CELL_W-CELL_GAP}px;height:36px;border:2px dashed rgba(255,255,255,0.12);border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.7rem;color:var(--text-3);transition:border-color .15s;`;
  ghost.textContent = '+ Add';
  ghost.onmouseenter = () => ghost.style.borderColor = 'rgba(255,60,90,.5)';
  ghost.onmouseleave = () => ghost.style.borderColor = 'rgba(255,255,255,0.12)';
  ghost.onclick = addFrame;
  mc.appendChild(ghost);
}

function buildRuler(totalPx) {
  const ruler = document.getElementById('tl-ruler');
  ruler.innerHTML = '';
  ruler.style.width = (LEFT + totalPx) + 'px';
  const secCount = Math.ceil(totalPx / (fps * (CELL_W + CELL_GAP) / 4)) + 2;
  for (let s = 0; s <= secCount; s++) {
    const tick = document.createElement('div');
    tick.className = 'ruler-tick';
    tick.style.width = (fps * (CELL_W + CELL_GAP) / 4) + 'px';
    tick.style.flexShrink = '0';
    tick.textContent = fmtTime(s);
    ruler.appendChild(tick);
  }
}

function highlightFrame(i) {
  document.querySelectorAll('.frame-cell').forEach(el => {
    el.classList.toggle('sel', +el.dataset.idx === i);
  });
  const el = document.querySelector(`.frame-cell[data-idx="${i}"]`);
  if (el) el.scrollIntoView({ block:'nearest', inline:'center', behavior:'smooth' });
  const ph = document.getElementById('playhead');
  const holdSum = frames.slice(0, i).reduce((a, f) => a + (f.holdFrames || 4), 0);
  ph.style.left = (LEFT + holdSum * (CELL_W + CELL_GAP) / 4) + 'px';
}

function updateTimecode(frameIdx) {
  const holdSum = frames.slice(0, frameIdx).reduce((a, f) => a + (f.holdFrames || 4), 0);
  document.getElementById('timecode').textContent = fmtTime(holdSum / fps);
}

function updateTimecodeLabel() {
  const totalF = frames.reduce((a, f) => a + (f.holdFrames || 4), 0);
  const secs = totalF / fps;
  document.getElementById('duration-label').textContent = `| ${frames.length} frames · ${secs.toFixed(1)}s`;
  document.getElementById('fps-indicator').textContent = fps + ' FPS · ' + totalDuration();
}

function totalDuration() {
  const totalHoldFrames = frames.reduce((a, f) => a + (f.holdFrames || 4), 0);
  return fmtTime(totalHoldFrames / fps);
}

function fmtTime(secs) {
  const m = Math.floor(secs / 60), s = Math.floor(secs % 60), cs = Math.floor((secs % 1) * 100);
  return `${pad(m)}:${pad(s)}:${pad(cs)}`;
}
function pad(n) { return String(n).padStart(2, '0'); }

// ── UNDO/REDO ──
function pushUndo() {
  undoStack.push({ frames: JSON.parse(JSON.stringify(frames)), cur: currentFrame, S: JSON.parse(JSON.stringify(S)) });
  redoStack = [];
  if (undoStack.length > 60) undoStack.shift();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push({ frames: JSON.parse(JSON.stringify(frames)), cur: currentFrame, S: JSON.parse(JSON.stringify(S)) });
  const u = undoStack.pop();
  frames = u.frames; currentFrame = u.cur; Object.assign(S, u.S);
  buildTimeline(); updateTimecodeLabel();
  if (currentFrame >= 0 && frames.length) applyState(frames[currentFrame]);
  toast('Undo', '');
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push({ frames: JSON.parse(JSON.stringify(frames)), cur: currentFrame, S: JSON.parse(JSON.stringify(S)) });
  const r = redoStack.pop();
  frames = r.frames; currentFrame = r.cur; Object.assign(S, r.S);
  buildTimeline(); updateTimecodeLabel();
  if (currentFrame >= 0 && frames.length) applyState(frames[currentFrame]);
  toast('Redo', '');
}

// ── TEMPLATES ──
function loadTemplate(idx) {
  const tmpl = TEMPLATES[idx];
  if (!tmpl) return;
  pushUndo();
  frames = [];
  const defaultChar = {
    charId:'prash',exprId:'normal',pose:'stand',
    charX:45,charY:58,charScale:1,flip:false,rotation:0,
    skinColor:'#f4a261',shirtColor:'#e63946',hairColor:'#1a1a2e',
    dialogue:'',bubbleType:'speech',
    textBold:false,textItalic:false,textCaps:false,textColor:'#111',fontSize:14,
    walkDir:'none',walkSpeed:4,lipsync:'auto',mouthOverride:null,
  };
  tmpl.frames.forEach(fr => {
    frames.push({
      bgId: fr.bgId || 'classroom',
      effects: fr.effects || [],
      soundTags: fr.soundTags || [],
      holdFrames: fr.holdFrames || 6,
      activeChar: 0,
      chars: (fr.chars || [{ charId: fr.charId }]).map(ch => ({ ...defaultChar, ...ch })),
    });
  });
  currentFrame = 0;
  applyState(frames[0]);
  buildTimeline(); updateTimecodeLabel();
  toast('Template: ' + tmpl.name, 'success');
}
