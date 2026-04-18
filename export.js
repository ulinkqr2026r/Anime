/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — export.js
   Export: WebM video, PNG frames, project save/load
═══════════════════════════════════════════ */

function saveProject() {
  const data = JSON.stringify({
    version: 2, fps, frames,
    name: document.getElementById('project-name').value,
    S: JSON.parse(JSON.stringify(S)),
  });
  download(new Blob([data], { type: 'application/json' }),
    (document.getElementById('project-name').value || 'project') + '.animastudio');
  toast('Project saved!', 'success');
}

function importProject() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.animastudio,.json';
  input.onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        pushUndo();
        fps = data.fps || 24;
        document.getElementById('fps-sel').value = fps;
        frames = data.frames || [];
        // Migrate v1 frames (single char) to v2 (chars array)
        frames = frames.map(fr => {
          if (!fr.chars) {
            fr.chars = [{
              charId: fr.charId || 'prash',
              exprId: fr.exprId || 'normal',
              pose: fr.pose || 'stand',
              charX: fr.charX || 45,
              charY: fr.charY || 58,
              charScale: fr.charScale || 1,
              flip: fr.flip || false,
              rotation: fr.rotation || 0,
              skinColor: fr.skinColor || '#f4a261',
              shirtColor: fr.shirtColor || '#e63946',
              hairColor: fr.hairColor || '#1a1a2e',
              dialogue: fr.dialogue || '',
              bubbleType: fr.bubbleType || 'speech',
              textBold: fr.textBold || false,
              textItalic: fr.textItalic || false,
              textCaps: fr.textCaps || false,
              textColor: fr.textColor || '#111111',
              fontSize: fr.fontSize || 14,
              walkDir: 'none', walkSpeed: 4,
              lipsync: 'auto', mouthOverride: null,
            }];
          }
          return fr;
        });
        if (data.name) document.getElementById('project-name').value = data.name;
        currentFrame = frames.length ? 0 : -1;
        if (currentFrame >= 0) applyState(frames[0]);
        buildTimeline(); updateTimecodeLabel();
        toast('Project loaded!', 'success');
      } catch (err) { toast('Failed to load project', 'error'); }
    };
    reader.readAsText(file);
  };
  input.click();
}

async function doExport() {
  if (!frames.length) { toast('Add frames first!', 'error'); return; }
  const statusEl = document.getElementById('exp-status');
  const barEl    = document.getElementById('exp-bar');
  const progressEl = document.getElementById('exp-progress');
  progressEl.style.display = 'block';
  barEl.style.width = '0%';

  if (exportMode === 'project') {
    saveProject();
    progressEl.style.display = 'none';
    closeModal('export-modal');
    return;
  }

  const resVal = +document.getElementById('exp-res').value || 720;
  const expW = resVal === 480 ? 854 : resVal === 1080 ? 1920 : 1280;
  const expH = resVal === 480 ? 480 : resVal === 1080 ? 1080 : 720;

  if (exportMode === 'frames') {
    for (let i = 0; i < frames.length; i++) {
      barEl.style.width = ((i+1)/frames.length*100) + '%';
      statusEl.textContent = `Exporting frame ${i+1} of ${frames.length}…`;
      await sleep(30);
      const tc = makeCanvas(expW, expH);
      redraw(tc.getContext('2d'), expW, expH, frames[i]);
      download(await canvasToBlob(tc), `frame_${String(i+1).padStart(3,'0')}.png`);
    }
    toast('All frames exported!', 'success');
    progressEl.style.display = 'none';
    closeModal('export-modal');
    return;
  }

  if (exportMode === 'mp4') {
    statusEl.textContent = 'Capturing frames for WebM video…';
    barEl.style.width = '10%';
    const tc = makeCanvas(expW, expH);
    const stream = tc.captureStream(fps);
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 4_000_000 });
    const chunks = [];
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      download(blob, (document.getElementById('project-name').value || 'anima') + '.webm');
      toast('Video exported!', 'success');
      progressEl.style.display = 'none';
      closeModal('export-modal');
    };
    rec.start();
    let fi = 0, hc = 0, tick = 0;
    const totalTicks = frames.reduce((a,f) => a + (f.holdFrames||4), 0);
    const ival = setInterval(() => {
      if (fi >= frames.length) { clearInterval(ival); setTimeout(() => rec.stop(), 200); return; }
      redraw(tc.getContext('2d'), expW, expH, frames[fi]);
      const hold = frames[fi].holdFrames || 4;
      hc++; tick++;
      barEl.style.width = (tick/totalTicks*90 + 10) + '%';
      statusEl.textContent = `Frame ${fi+1}/${frames.length} · ${(tick/fps).toFixed(1)}s`;
      if (hc >= hold) { hc = 0; fi++; }
    }, 1000/fps);
    return;
  }

  // GIF — export as PNG frames + tip
  statusEl.textContent = 'Building GIF frames…';
  for (let i = 0; i < Math.min(frames.length, 30); i++) {
    barEl.style.width = ((i+1)/Math.min(frames.length,30)*100) + '%';
    statusEl.textContent = `Frame ${i+1}/${frames.length} — Use EZGif.com to combine PNG frames into GIF`;
    await sleep(30);
    const tc = makeCanvas(expW, expH);
    redraw(tc.getContext('2d'), expW, expH, frames[i]);
    download(await canvasToBlob(tc), `gif_frame_${String(i+1).padStart(3,'0')}.png`);
  }
  toast('Frames exported! → EZGif.com → GIF Maker', 'success');
  progressEl.style.display = 'none';
  closeModal('export-modal');
}

// ── HELPERS ──
function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
function canvasToBlob(c) {
  return new Promise(r => c.toBlob(r, 'image/png'));
}
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
