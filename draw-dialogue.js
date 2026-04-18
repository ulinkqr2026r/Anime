/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — draw-dialogue.js
   Speech bubbles, captions, thought clouds
═══════════════════════════════════════════ */

function drawDialogue(c, text, type, cx, cy, scale, w, h, frameState) {
  if (!text || type === 'none') return;
  const s = frameState;
  const fsize = Math.max(10, (s.fontSize || 14) * (w / 900));
  const bold = s.textBold ? 'bold ' : '';
  const italic = s.textItalic ? 'italic ' : '';
  const displayText = s.textCaps ? text.toUpperCase() : text;
  const font = `${italic}${bold}${fsize}px ${type==='angry'||type==='shout'?'Bebas Neue,cursive':'DM Sans,sans-serif'}`;
  c.font = font;

  const maxW = w * .52;
  const words = displayText.split(' ');
  let lines = [], line = '';
  for (let wd of words) {
    const test = line ? line+' '+wd : wd;
    if (c.measureText(test).width > maxW) { lines.push(line); line = wd; } else line = test;
  }
  if (line) lines.push(line);

  const lh = fsize * 1.45;
  const tw = Math.max(...lines.map(l => c.measureText(l).width));
  const th = lines.length * lh;
  const pad = Math.max(10, 16 * (w / 1280));
  const u = 80 * scale;

  let bx = cx - tw/2 - pad;
  let by = cy - u * .72 - th - pad*2 - 28;
  if (bx < 8) bx = 8;
  if (bx + tw + pad*2 > w - 8) bx = w - tw - pad*2 - 8;
  if (by < 8) by = 8;

  const bw = tw + pad*2, bh = th + pad*2;
  c.save();

  if (type === 'caption') {
    c.fillStyle = 'rgba(0,0,0,.85)';
    c.fillRect(0, h - bh - 20, w, bh + 20);
    c.font = font;
    c.fillStyle = s.textColor || '#fff'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    lines.forEach((l, i) => c.fillText(l, w/2, h - bh - 4 + lh*(i+.85)));
    c.restore(); return;
  }

  c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 12; c.shadowOffsetY = 4;
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';

  if (type === 'speech') {
    c.fillStyle = '#fff'; c.strokeStyle = '#111'; c.lineWidth = 2.5;
    _roundRect(c, bx, by, bw, bh, 14); c.fill(); c.stroke();
    c.shadowBlur = 0;
    _bubbleTail(c, cx, by+bh, '#fff', '#111', 2.5);
    c.fillStyle = s.textColor || '#111';
  } else if (type === 'thought') {
    c.fillStyle = '#fff'; c.strokeStyle = '#aaa'; c.lineWidth = 2;
    _roundRect(c, bx, by, bw, bh, 20); c.fill(); c.stroke();
    c.shadowBlur = 0;
    for (let i = 0; i < 3; i++) {
      c.beginPath(); c.arc(cx-8+i*8, by+bh+8+i*6, 4-i, 0, Math.PI*2);
      c.fillStyle = '#fff'; c.fill(); c.strokeStyle = '#aaa'; c.stroke();
    }
    c.fillStyle = s.textColor || '#555';
  } else if (type === 'angry') {
    c.fillStyle = '#cc0000'; c.strokeStyle = '#900'; c.lineWidth = 3;
    _jaggedBubble(c, bx, by, bw, bh, 10);
    c.shadowBlur = 0;
    c.fillStyle = '#ffe000'; c.font = `${bold}${italic}${fsize*1.05}px Bebas Neue,cursive`;
  } else if (type === 'shout') {
    c.fillStyle = '#ffd600'; c.strokeStyle = '#ff8c00'; c.lineWidth = 3;
    _jaggedBubble(c, bx, by, bw, bh, 8);
    c.shadowBlur = 0;
    _bubbleTail(c, cx, by+bh, '#ffd600', '#ff8c00', 3);
    c.fillStyle = '#c00'; c.font = `900 ${fsize*1.05}px Bebas Neue,cursive`;
  }

  c.shadowBlur = 0;
  lines.forEach((l, i) => c.fillText(l, bx + bw/2, by + pad + lh*(i+.82)));
  c.restore();
}

function _roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x+r,y); c.lineTo(x+w-r,y); c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r); c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h); c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r); c.quadraticCurveTo(x,y,x+r,y); c.closePath();
}

function _jaggedBubble(c, x, y, w, h, spikes) {
  const amp = 9;
  c.beginPath(); c.moveTo(x+10,y);
  for (let i=0;i<=spikes;i++) { const px=x+10+(w-20)*i/spikes; c.lineTo(px+3,i%2===0?y:y-amp); c.lineTo(px+6,y); }
  c.lineTo(x+w,y+10);
  for (let i=0;i<=spikes;i++) { const py=y+10+(h-20)*i/spikes; c.lineTo(i%2===0?x+w:x+w+amp,py+3); c.lineTo(x+w,py+6); }
  c.lineTo(x+w-10,y+h);
  for (let i=spikes;i>=0;i--) { const px=x+10+(w-20)*i/spikes; c.lineTo(px+3,i%2===0?y+h:y+h+amp); c.lineTo(px,y+h); }
  c.lineTo(x,y+h-10);
  for (let i=spikes;i>=0;i--) { const py=y+10+(h-20)*i/spikes; c.lineTo(i%2===0?x:x-amp,py+3); c.lineTo(x,py); }
  c.closePath(); c.fill(); c.stroke();
}

function _bubbleTail(c, cx, by, fill, stroke, lw) {
  c.fillStyle = fill; c.strokeStyle = stroke; c.lineWidth = lw;
  c.beginPath();
  c.moveTo(cx-10,by); c.lineTo(cx+10,by); c.lineTo(cx,by+20);
  c.closePath(); c.fill(); c.stroke();
}
