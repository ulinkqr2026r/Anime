/* ═══════════════════════════════════════════
   ANIMASTUDIO PRO — draw-effects.js
   Particle & overlay effects (behind + front)
═══════════════════════════════════════════ */

function drawFXBehind(c, w, h, effects) {
  const t = Date.now() / 1000;
  if (effects.includes('speedlines')) {
    c.save(); c.globalAlpha = .18;
    for (let i = 0; i < 40; i++) {
      const a = i*(Math.PI*2/40);
      c.strokeStyle = i%2===0?'#fff':'rgba(255,255,255,.5)'; c.lineWidth = 1.5 + i%3;
      c.beginPath(); c.moveTo(w/2,h/2); c.lineTo(w/2+Math.cos(a)*w*1.5, h/2+Math.sin(a)*h*1.5); c.stroke();
    }
    c.restore();
  }
  if (effects.includes('fire_fx')) {
    c.save();
    for (let i = 0; i < 14; i++) {
      const fx = i*w*.077, fw = w*.07;
      const fg = c.createLinearGradient(fx,h,fx,0);
      fg.addColorStop(0,'rgba(255,50,0,.7)'); fg.addColorStop(.6,'rgba(255,130,0,.3)'); fg.addColorStop(1,'transparent');
      c.fillStyle = fg; c.globalAlpha = .65;
      c.beginPath(); c.ellipse(fx+fw/2, h*.8, fw/2, h*.42+Math.sin(t+i)*h*.04, Math.sin(t+i)*.12, 0, Math.PI*2); c.fill();
    }
    c.restore();
  }
  if (effects.includes('rainbow')) {
    c.save(); c.globalAlpha = .12;
    ['#ff0000','#ff7700','#ffff00','#00ff00','#0000ff','#8b00ff'].forEach((col,i) => {
      c.strokeStyle = col; c.lineWidth = w*.04;
      c.beginPath(); c.arc(w*.5, h*.9, w*(.25+i*.06), Math.PI, 0); c.stroke();
    });
    c.restore();
  }
}

function drawFXFront(c, w, h, effects, soundTags) {
  const t = Date.now() / 1000;

  if (effects.includes('impact')) {
    c.save();
    const labels = ['BAKA!!','ROASTED! 💀','OH NOOOO!','😂 LOL!','GET REKT!'];
    const lbl = labels[Math.floor(t/2) % labels.length];
    c.font = `900 ${w*.09}px Bebas Neue,cursive`; c.textAlign = 'left';
    c.fillStyle = 'rgba(0,0,0,.5)'; c.fillText(lbl, w*.05+3, h*.15+3);
    c.fillStyle = '#ffd600'; c.strokeStyle = '#ff3c5a'; c.lineWidth = 5;
    c.strokeText(lbl, w*.05, h*.15); c.fillText(lbl, w*.05, h*.15);
    c.restore();
  }

  if (effects.includes('sakura')) {
    c.save(); c.globalAlpha = .8; c.fillStyle = '#ffb7c5';
    for (let i = 0; i < 22; i++) {
      const sx = ((i*137 + t*40) % w), sy = ((i*73 + t*28) % h);
      c.save(); c.translate(sx, sy); c.rotate(t + i);
      c.beginPath();
      for (let p = 0; p < 5; p++) {
        const a = p*(Math.PI*2/5) - Math.PI/2;
        const r = p===0?5:3;
        c[p===0?'moveTo':'lineTo'](Math.cos(a)*r, Math.sin(a)*r);
      }
      c.closePath(); c.fill(); c.restore();
    }
    c.restore();
  }

  if (effects.includes('stars')) {
    c.save(); c.globalAlpha = .9;
    c.font = `${w*.035}px serif`; c.textAlign = 'center';
    [[.06,.09],[.87,.06],[.12,.82],[.9,.85],[.5,.04],[.04,.52],[.96,.52],[.5,.93]].forEach(([px,py],i) => {
      c.fillStyle = i%2===0?'#ffd600':'#fff';
      c.fillText(i%2===0?'⭐':'✧', px*w+Math.sin(t+i)*10, py*h+Math.cos(t+i)*8);
    });
    c.restore();
  }

  if (effects.includes('sweat')) {
    c.save();
    for (let i = 0; i < 6; i++) {
      c.fillStyle = '#66b2ff'; c.globalAlpha = .75;
      const sx = w*.08+i*w*.17, sy = h*.18+Math.sin(t+i)*h*.05;
      c.beginPath(); c.moveTo(sx,sy-8); c.quadraticCurveTo(sx+6,sy+4,sx,sy+10); c.quadraticCurveTo(sx-6,sy+4,sx,sy-8); c.fill();
    }
    c.restore();
  }

  if (effects.includes('smoke')) {
    c.save();
    for (let i = 0; i < 8; i++) {
      c.fillStyle = 'rgba(180,180,180,0.2)';
      c.beginPath(); c.arc(w*.25+i*w*.07+Math.sin(t+i)*10, h*.15+Math.cos(t*1.3+i)*h*.04, w*.03+Math.sin(t+i)*5, 0, Math.PI*2); c.fill();
    }
    c.restore();
  }

  if (effects.includes('lightning')) {
    c.save(); c.globalAlpha = 0.85;
    [[[w*.08,0],[w*.18,h*.28],[w*.1,h*.28],[w*.2,h*.52]],
     [[w*.83,0],[w*.75,h*.22],[w*.83,h*.22],[w*.75,h*.45]]].forEach(pts => {
      c.strokeStyle='#ffd600'; c.lineWidth=4; c.shadowColor='#ffd600'; c.shadowBlur=15;
      c.beginPath(); pts.forEach(([px,py],i)=>c[i===0?'moveTo':'lineTo'](px,py)); c.stroke();
      c.strokeStyle='#fff'; c.lineWidth=1.5; c.beginPath(); pts.forEach(([px,py],i)=>c[i===0?'moveTo':'lineTo'](px,py)); c.stroke();
      c.shadowBlur=0;
    });
    c.restore();
  }

  if (effects.includes('hearts')) {
    c.save(); c.font = `${w*.03}px serif`; c.textAlign = 'center';
    [[.07,.07],[.86,.1],[.5,.04],[.14,.43],[.88,.43]].forEach(([px,py],i) => {
      c.globalAlpha = 0.8+Math.sin(t*2+i)*.15;
      c.fillText('❤️', px*w+Math.sin(t+i)*10, py*h+Math.cos(t+i)*8);
    });
    c.restore();
  }

  if (effects.includes('question')) {
    c.save(); c.font = `900 ${w*.065}px Bebas Neue,cursive`; c.textAlign = 'center'; c.globalAlpha = .9;
    ['?','!','?','??','!','?!'].forEach((q,i) => {
      c.fillStyle = ['#9b59f5','#ff3c5a','#ffd600'][i%3];
      c.fillText(q, (i+.5)*w/6, h*.1+Math.sin(t*1.5+i)*h*.03);
    });
    c.restore();
  }

  if (effects.includes('money')) {
    c.save(); c.font = `${w*.03}px serif`; c.textAlign = 'center';
    for (let i = 0; i < 10; i++) {
      c.globalAlpha = 0.7; c.fillStyle = '#00e87a';
      const mx = ((i*137 + t*60) % w), my = ((i*53 + t*45) % h);
      c.fillText('💸', mx, my);
    }
    c.restore();
  }

  // Sound tags
  if (soundTags && soundTags.length) {
    c.save();
    const tagMap = { pow:'💥 POW!', bam:'🔴 BAM!', nooo:'😱 NOOO!', lol:'😂 LOL!', omg:'😮 OMG!', oof:'😬 OOF!' };
    soundTags.forEach((tag, i) => {
      const label = tagMap[tag] || tag.toUpperCase();
      const tx = w*(.1 + i*.22), ty = h*(.12 + Math.sin(t*3+i)*.02);
      c.font = `900 ${w*.055}px Bebas Neue,cursive`; c.textAlign = 'center';
      c.fillStyle = '#000'; c.fillText(label, tx+2, ty+2);
      c.fillStyle = '#ffd600'; c.strokeStyle = '#ff3c5a'; c.lineWidth = 3;
      c.strokeText(label, tx, ty); c.fillText(label, tx, ty);
    });
    c.restore();
  }
}
