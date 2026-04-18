/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — draw-backgrounds.js
   All 12 background renderers
═══════════════════════════════════════════ */

function drawBackground(c, W, H, bgId) {
  const fn = BG_DRAW_FNS[bgId] || BG_DRAW_FNS.classroom;
  fn(c, W, H);
}

const BG_DRAW_FNS = {
  classroom: bgClassroom,
  street: bgStreet,
  home: bgHome,
  epic: bgEpic,
  office: bgOffice,
  sky: bgSky,
  fire: bgFire,
  black: bgDark,
  manga: bgManga,
  rooftop: bgRooftop,
  gym: bgGym,
  space: bgSpace,
};

function bgClassroom(c, W, H) {
  // Sky / wall
  const wallG = c.createLinearGradient(0,0,0,H*.75);
  wallG.addColorStop(0,'#e8f4fd'); wallG.addColorStop(1,'#d0e8f8');
  c.fillStyle = wallG; c.fillRect(0,0,W,H*.75);
  // Blackboard
  c.fillStyle = '#1a5c2a'; c.fillRect(W*.05,H*.04,W*.9,H*.35);
  c.strokeStyle = '#8b4513'; c.lineWidth = H*.018;
  c.strokeRect(W*.05,H*.04,W*.9,H*.35);
  // Chalk lines
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    c.beginPath(); c.moveTo(W*.08, H*(.1 + i*.075)); c.lineTo(W*.92, H*(.1 + i*.075)); c.stroke();
  }
  // Chalk text
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.font = `bold ${H*.05}px Bebas Neue,cursive`; c.textAlign = 'center';
  c.fillText('ANIMASTUDIO PRO', W*.5, H*.22);
  // Floor
  const floorG = c.createLinearGradient(0,H*.75,0,H);
  floorG.addColorStop(0,'#c8a96e'); floorG.addColorStop(1,'#b0924d');
  c.fillStyle = floorG; c.fillRect(0,H*.75,W,H*.25);
  // Floor tiles
  c.strokeStyle = 'rgba(0,0,0,0.1)'; c.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    c.beginPath(); c.moveTo(i*W/10,H*.75); c.lineTo(i*W/10,H); c.stroke();
    c.beginPath(); c.moveTo(0, H*.75+i*(H*.25/4)); c.lineTo(W, H*.75+i*(H*.25/4)); c.stroke();
  }
  // Desk
  c.fillStyle = '#8b4513'; c.fillRect(W*.05,H*.68,W*.3,H*.07);
  c.fillStyle = '#5c2f0a'; c.fillRect(W*.08,H*.75,W*.06,H*.1); c.fillRect(W*.27,H*.75,W*.06,H*.1);
}

function bgStreet(c, W, H) {
  const skyG = c.createLinearGradient(0,0,0,H*.6);
  skyG.addColorStop(0,'#87ceeb'); skyG.addColorStop(1,'#b0d4f0');
  c.fillStyle = skyG; c.fillRect(0,0,W,H*.6);
  // Buildings
  const buildings = [[0,.12,.2,.55],[.18,.05,.18,.55],[.35,.15,.15,.45],[.5,.08,.2,.52],[.7,.12,.15,.48],[.84,.04,.16,.56]];
  buildings.forEach(([bx,by,bw,bh],i) => {
    const cols = ['#6b7280','#8b95a0','#7c8a9e','#555f6e','#6e7a8a','#778899'];
    c.fillStyle = cols[i]; c.fillRect(bx*W, by*H, bw*W, bh*H);
    // Windows
    c.fillStyle = 'rgba(255,230,80,0.6)';
    for (let wy = by + .04; wy < by + bh - .04; wy += .07) {
      for (let wx = bx + .01; wx < bx + bw - .01; wx += .04) {
        if (Math.random() > .3) c.fillRect(wx*W, wy*H, W*.025, H*.04);
      }
    }
  });
  // Road
  c.fillStyle = '#4a4a4a'; c.fillRect(0,H*.6,W,H*.4);
  c.fillStyle = '#5a5a5a'; c.fillRect(0,H*.62,W,H*.02);
  // Lane markings
  c.strokeStyle = '#ffd600'; c.lineWidth = H*.005; c.setLineDash([W*.05, W*.03]);
  c.beginPath(); c.moveTo(0,H*.8); c.lineTo(W,H*.8); c.stroke(); c.setLineDash([]);
  // Sidewalk
  c.fillStyle = '#c8c8c8'; c.fillRect(0,H*.6,W,H*.05);
}

function bgHome(c, W, H) {
  // Wall
  const wallG = c.createLinearGradient(0,0,0,H);
  wallG.addColorStop(0,'#f5e6d0'); wallG.addColorStop(1,'#e8d4b8');
  c.fillStyle = wallG; c.fillRect(0,0,W,H*.72);
  // Wallpaper pattern
  c.strokeStyle = 'rgba(180,140,100,0.15)'; c.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    c.beginPath(); c.arc(i*W/10, H*.2, H*.08, 0, Math.PI*2); c.stroke();
  }
  // Window
  c.fillStyle = '#87ceeb'; c.fillRect(W*.65,H*.05,W*.28,H*.3);
  c.strokeStyle = '#8b6914'; c.lineWidth = H*.015;
  c.strokeRect(W*.65,H*.05,W*.28,H*.3);
  c.strokeStyle = '#8b6914'; c.lineWidth = H*.008;
  c.beginPath(); c.moveTo(W*.79,H*.05); c.lineTo(W*.79,H*.35); c.stroke();
  c.beginPath(); c.moveTo(W*.65,H*.2); c.lineTo(W*.93,H*.2); c.stroke();
  // Sofa
  c.fillStyle = '#8b6b4a'; c.beginPath(); c.roundRect(W*.05,H*.55,W*.55,H*.2,H*.02); c.fill();
  c.fillStyle = '#a07850'; c.fillRect(W*.05,H*.55,W*.55,H*.06);
  c.fillStyle = '#9b7048'; c.fillRect(W*.05,H*.55,W*.1,H*.2);
  c.fillRect(W*.5,H*.55,W*.1,H*.2);
  // TV
  c.fillStyle = '#111'; c.fillRect(W*.7,H*.38,W*.2,H*.18);
  c.fillStyle = '#1a6aff'; c.fillRect(W*.71,H*.39,W*.18,H*.15);
  c.fillStyle = '#333'; c.fillRect(W*.77,H*.56,W*.06,H*.04);
  // Floor
  c.fillStyle = '#c8a978'; c.fillRect(0,H*.72,W,H*.28);
  c.strokeStyle = 'rgba(100,70,30,0.15)'; c.lineWidth = 2;
  for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(i*W/8,H*.72); c.lineTo(i*W/8,H); c.stroke(); }
}

function bgEpic(c, W, H) {
  // Dark sky
  c.fillStyle = '#0a001a'; c.fillRect(0,0,W,H);
  // Energy gradient
  const eg = c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.4,W*.7);
  eg.addColorStop(0,'rgba(155,89,245,0.25)'); eg.addColorStop(.5,'rgba(255,60,90,0.1)'); eg.addColorStop(1,'transparent');
  c.fillStyle = eg; c.fillRect(0,0,W,H);
  // Speed lines from center
  c.save(); c.globalAlpha = .12;
  for (let i = 0; i < 48; i++) {
    const a = i * (Math.PI*2/48);
    c.strokeStyle = i%3===0?'#9b59f5':i%3===1?'#ff3c5a':'#fff'; c.lineWidth = 1 + i%3;
    c.beginPath(); c.moveTo(W*.5, H*.4); c.lineTo(W*.5 + Math.cos(a)*W*1.5, H*.4 + Math.sin(a)*H*1.5); c.stroke();
  }
  c.restore();
  // Cracks in ground
  c.fillStyle = '#1a0030'; c.fillRect(0,H*.65,W,H*.35);
  c.strokeStyle = 'rgba(155,89,245,0.5)'; c.lineWidth = 2;
  [[.1,.65,.35,.9],[.4,.65,.3,.85],[.55,.7,.9,.95],[.2,.75,.5,.95]].forEach(([x1,y1,x2,y2]) => {
    c.beginPath(); c.moveTo(x1*W, y1*H); c.lineTo(x2*W, y2*H); c.stroke();
  });
  // Epic glow circle
  const gc = c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.4,H*.3);
  gc.addColorStop(0,'rgba(255,255,255,0.05)'); gc.addColorStop(1,'transparent');
  c.fillStyle = gc; c.fillRect(0,0,W,H);
}

function bgOffice(c, W, H) {
  c.fillStyle = '#e8e8e8'; c.fillRect(0,0,W,H*.72);
  // Grid ceiling tiles
  c.strokeStyle = '#ccc'; c.lineWidth = 1;
  for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(i*W/5, 0); c.lineTo(i*W/5, H*.72); c.stroke(); }
  for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(0, i*H*.14); c.lineTo(W, i*H*.14); c.stroke(); }
  // Monitor
  c.fillStyle = '#111'; c.fillRect(W*.6,H*.3,W*.3,H*.28);
  c.fillStyle = '#1a6aff'; c.fillRect(W*.61,H*.31,W*.28,H*.25);
  c.fillStyle = '#444'; c.fillRect(W*.73,H*.58,W*.04,H*.07);
  c.fillStyle = '#333'; c.fillRect(W*.67,H*.65,W*.16,H*.02);
  // Desk
  c.fillStyle = '#8b6914'; c.fillRect(W*.04,H*.6,W*.9,H*.06);
  c.fillStyle = '#6b5010'; c.fillRect(W*.06,H*.66,W*.05,H*.1); c.fillRect(W*.89,H*.66,W*.05,H*.1);
  // Office chair back
  c.fillStyle = '#333'; c.beginPath(); c.roundRect(W*.2,H*.35,W*.15,H*.25,W*.01); c.fill();
  // Floor
  c.fillStyle = '#b0b0b0'; c.fillRect(0,H*.72,W,H*.28);
}

function bgSky(c, W, H) {
  const sg = c.createLinearGradient(0,0,0,H);
  sg.addColorStop(0,'#1a1a4a'); sg.addColorStop(.3,'#c04a00'); sg.addColorStop(.5,'#ff6600'); sg.addColorStop(.7,'#ffa500'); sg.addColorStop(1,'#ffcc00');
  c.fillStyle = sg; c.fillRect(0,0,W,H);
  // Sun
  c.fillStyle = '#ffe566';
  const sunG = c.createRadialGradient(W*.5,H*.55,0,W*.5,H*.55,W*.15);
  sunG.addColorStop(0,'rgba(255,230,100,1)'); sunG.addColorStop(.5,'rgba(255,160,0,.8)'); sunG.addColorStop(1,'transparent');
  c.fillStyle = sunG; c.fillRect(0,0,W,H);
  // Clouds
  c.fillStyle = 'rgba(255,220,150,0.4)';
  [[.1,.15,.2],[.35,.1,.25],[.65,.12,.2],[.8,.18,.15]].forEach(([cx,cy,cr]) => {
    c.beginPath(); c.ellipse(cx*W, cy*H, cr*W, cr*H*.5, 0, 0, Math.PI*2); c.fill();
  });
  // Silhouette city
  c.fillStyle = '#1a1a2e';
  [[0,.6,.08,.35],[.06,.55,.1,.4],[.15,.5,.08,.45],[.22,.58,.1,.37],[.38,.52,.12,.43],[.5,.48,.09,.47],[.59,.55,.11,.4],[.7,.5,.1,.45],[.82,.56,.1,.39],[.91,.52,.09,.43]].forEach(([bx,by,bw,bh]) => {
    c.fillRect(bx*W, by*H, bw*W, bh*H);
  });
}

function bgFire(c, W, H) {
  c.fillStyle = '#1a0000'; c.fillRect(0,0,W,H);
  const t = Date.now() / 500;
  for (let i = 0; i < 16; i++) {
    const fx = i * W*.07;
    const fg = c.createLinearGradient(fx, H, fx, 0);
    fg.addColorStop(0,'rgba(255,40,0,.9)'); fg.addColorStop(.4,'rgba(255,120,0,.6)'); fg.addColorStop(.7,'rgba(255,200,0,.2)'); fg.addColorStop(1,'transparent');
    c.fillStyle = fg;
    c.beginPath(); c.ellipse(fx + W*.04, H*.8, W*.06, H*.45 + Math.sin(t + i) * H*.06, Math.sin(t + i)*.15, 0, Math.PI*2); c.fill();
  }
  const glow = c.createRadialGradient(W*.5, H, 0, W*.5, H, H*.8);
  glow.addColorStop(0,'rgba(255,80,0,0.3)'); glow.addColorStop(1,'transparent');
  c.fillStyle = glow; c.fillRect(0,0,W,H);
}

function bgDark(c, W, H) {
  c.fillStyle = '#050507'; c.fillRect(0,0,W,H);
  // Subtle vignette
  const vig = c.createRadialGradient(W*.5,H*.5,H*.1,W*.5,H*.5,W*.8);
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,0.7)');
  c.fillStyle = vig; c.fillRect(0,0,W,H);
  // Subtle grid
  c.strokeStyle = 'rgba(255,255,255,0.03)'; c.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    c.beginPath(); c.moveTo(i*W/20,0); c.lineTo(i*W/20,H); c.stroke();
    c.beginPath(); c.moveTo(0,i*H/20); c.lineTo(W,i*H/20); c.stroke();
  }
  // Spotlight
  const spot = c.createRadialGradient(W*.5,0,0,W*.5,0,H*.9);
  spot.addColorStop(0,'rgba(255,255,255,0.06)'); spot.addColorStop(.5,'rgba(255,255,255,0.02)'); spot.addColorStop(1,'transparent');
  c.fillStyle = spot; c.fillRect(0,0,W,H);
}

function bgManga(c, W, H) {
  c.fillStyle = '#f0ece0'; c.fillRect(0,0,W,H);
  // Manga panels
  c.strokeStyle = '#111'; c.lineWidth = 3;
  c.strokeRect(W*.02,H*.02,W*.55,H*.52);
  c.strokeRect(W*.59,H*.02,W*.39,H*.25);
  c.strokeRect(W*.59,H*.29,W*.39,H*.25);
  c.strokeRect(W*.02,H*.56,W*.38,H*.42);
  c.strokeRect(W*.42,H*.56,W*.56,H*.42);
  // Speed lines in main panel
  c.save(); c.globalAlpha = .1;
  for (let i = 0; i < 30; i++) {
    const a = i*(Math.PI*2/30);
    c.strokeStyle = '#111'; c.lineWidth = 0.5+i%3*.5;
    c.beginPath(); c.moveTo(W*.29,H*.28); c.lineTo(W*.29+Math.cos(a)*W*.6,H*.28+Math.sin(a)*H*.6); c.stroke();
  }
  c.restore();
  // Halftone dots (top right panel)
  c.fillStyle = 'rgba(0,0,0,0.07)';
  for (let rx = W*.6; rx < W*.97; rx += W*.015) {
    for (let ry = H*.03; ry < H*.25; ry += H*.018) {
      c.beginPath(); c.arc(rx, ry, W*.004, 0, Math.PI*2); c.fill();
    }
  }
  // Sound effect text
  c.fillStyle = '#1a1a1a'; c.font = `900 ${H*.12}px Bebas Neue,cursive`; c.textAlign = 'center';
  c.globalAlpha = .15; c.fillText('BAKA!', W*.72, H*.22); c.globalAlpha = 1;
}

function bgRooftop(c, W, H) {
  const skyG = c.createLinearGradient(0,0,0,H*.65);
  skyG.addColorStop(0,'#0a0a1a'); skyG.addColorStop(1,'#1a1a4a');
  c.fillStyle = skyG; c.fillRect(0,0,W,H*.65);
  // Stars
  for (let i = 0; i < 80; i++) {
    c.fillStyle = `rgba(255,255,255,${.3+Math.random()*.6})`;
    c.beginPath(); c.arc(Math.random()*W, Math.random()*H*.55, Math.random()*1.5, 0, Math.PI*2); c.fill();
  }
  // City glow
  c.fillStyle = 'rgba(255,100,0,0.1)'; c.fillRect(0,H*.5,W,H*.15);
  // City silhouette
  c.fillStyle = '#111';
  [[0,.55,.08,.4],[.06,.5,.1,.45],[.15,.45,.1,.5],[.25,.52,.12,.43],[.37,.47,.09,.48],[.46,.42,.12,.53],[.58,.48,.1,.47],[.68,.5,.09,.45],[.77,.45,.12,.5],[.89,.52,.11,.43]].forEach(([bx,by,bw,bh]) => {
    c.fillRect(bx*W, by*H, bw*W, bh*H);
    // Windows
    c.fillStyle = 'rgba(255,200,50,0.4)';
    for (let wy = by+.03; wy < by+bh-0.03; wy+=.06) for (let wx=bx+.01;wx<bx+bw-.01;wx+=.03) {
      if(Math.random()>.5) c.fillRect(wx*W,wy*H,W*.018,H*.035);
    }
    c.fillStyle = '#111';
  });
  // Rooftop floor
  c.fillStyle = '#2a2a2a'; c.fillRect(0,H*.65,W,H*.35);
  // Railing
  c.strokeStyle = '#444'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(0,H*.67); c.lineTo(W,H*.67); c.stroke();
  c.fillStyle = '#333';
  for (let i = 0; i < 15; i++) c.fillRect(i*W/15, H*.65, W*.01, H*.04);
}

function bgGym(c, W, H) {
  c.fillStyle = '#1e2a3a'; c.fillRect(0,0,W,H*.72);
  c.strokeStyle = 'rgba(0,212,255,.12)'; c.lineWidth = 2;
  for (let i = 0; i < 4; i++) { c.strokeRect(i*W*.25+W*.01,H*.01,W*.24,H*.7); }
  c.fillStyle = '#2d2d2d'; c.fillRect(0,H*.72,W,H*.28);
  c.strokeStyle = '#ff3c5a'; c.lineWidth = 3;
  for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(0,H*.72+i*H*.05); c.lineTo(W,H*.72+i*H*.05); c.stroke(); }
  // Dumbbell
  c.fillStyle = '#555'; c.fillRect(W*.06,H*.6,W*.12,H*.05);
  c.fillStyle = '#333'; c.fillRect(W*.04,H*.57,W*.03,H*.11); c.fillRect(W*.16,H*.57,W*.03,H*.11);
  // Motivational text
  c.fillStyle = '#ff3c5a'; c.font = `bold ${H*.055}px Bebas Neue,cursive`; c.textAlign = 'center';
  c.globalAlpha = .8; c.fillText('NO PAIN NO GAIN', W/2, H*.1); c.globalAlpha = 1;
}

function bgSpace(c, W, H) {
  c.fillStyle = '#000010'; c.fillRect(0,0,W,H);
  // Stars
  for (let i = 0; i < 220; i++) {
    const br = Math.random();
    c.fillStyle = `rgba(255,255,255,${br*.8+.2})`;
    c.beginPath(); c.arc(Math.random()*W, Math.random()*H, Math.random()*1.8, 0, Math.PI*2); c.fill();
  }
  // Nebula
  const nb = c.createRadialGradient(W*.3,H*.4,0,W*.3,H*.4,W*.4);
  nb.addColorStop(0,'rgba(155,89,245,.2)'); nb.addColorStop(.5,'rgba(0,212,255,.08)'); nb.addColorStop(1,'transparent');
  c.fillStyle = nb; c.fillRect(0,0,W,H);
  // Planet
  c.fillStyle = '#2d3a6a'; c.beginPath(); c.arc(W*.8,H*.2,W*.1,0,Math.PI*2); c.fill();
  c.fillStyle = 'rgba(100,150,255,.15)'; c.beginPath(); c.arc(W*.8,H*.2,W*.12,0,Math.PI*2); c.fill();
  c.strokeStyle = 'rgba(150,180,255,.4)'; c.lineWidth = 5;
  c.beginPath(); c.ellipse(W*.8,H*.2,W*.17,W*.04,-.2,0,Math.PI*2); c.stroke();
  // Earth
  c.fillStyle = '#1a4a1a'; c.beginPath(); c.arc(W*.1,H*.8,W*.07,0,Math.PI*2); c.fill();
  c.fillStyle = '#1a3a6a'; c.beginPath(); c.arc(W*.1,H*.8,W*.07,-.5,.5); c.fill();
}
