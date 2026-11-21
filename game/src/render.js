// Canvas 2D rendering for Shadow Vault: bright readable top-down museum floor,
// glowing vision cones, crates as cover, lit pools vs shadow, and all screens.

import { FOV, inLight } from './guard.js';

function conePath(ctx, g) {
  ctx.beginPath();
  ctx.moveTo(g.x, g.y);
  ctx.arc(g.x, g.y, g.range, g.dir - FOV / 2, g.dir + FOV / 2);
  ctx.closePath();
}

function drawGuard(ctx, g, level) {
  // Vision cone, coloured by alert state.
  const col = g.state === 'chase' ? 'rgba(255,60,60,0.42)'
    : g.state === 'investigate' ? 'rgba(255,200,60,0.34)'
    : 'rgba(255,220,90,0.26)';
  ctx.fillStyle = col;
  conePath(ctx, g);
  ctx.fill();
  ctx.strokeStyle = g.state === 'chase' ? '#ff4444' : 'rgba(255,220,90,0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Detection meter ring above the guard.
  if (g.meter > 2) {
    ctx.fillStyle = '#111';
    ctx.fillRect(g.x - 16, g.y - 30, 32, 6);
    ctx.fillStyle = g.meter >= 100 ? '#ff4444' : g.meter >= 35 ? '#ffcc33' : '#7dff9a';
    ctx.fillRect(g.x - 15, g.y - 29, 30 * (g.meter / 100), 4);
  }
  // Guard body: dark uniform, red cap, facing tick.
  ctx.fillStyle = '#20263d';
  ctx.strokeStyle = '#ff5566';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(g.x, g.y, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff5566';
  ctx.beginPath(); ctx.arc(g.x, g.y, 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(g.x, g.y);
  ctx.lineTo(g.x + Math.cos(g.dir) * 18, g.y + Math.sin(g.dir) * 18);
  ctx.stroke();
  if (g.state === 'chase') {
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 20px Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('!', g.x, g.y - 34);
  } else if (g.state === 'investigate') {
    ctx.fillStyle = '#ffcc33';
    ctx.font = 'bold 20px Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', g.x, g.y - 34);
  }
}

function drawPlayer(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(0, 10, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = p.sneaking ? '#4dd0a5' : '#37b6ff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Hooded thief: darker hood + eyes in facing direction.
  ctx.fillStyle = '#0d2b45';
  ctx.beginPath(); ctx.arc(0, -2, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(-4 + p.faceX * 3, -4 + p.faceY * 3, 3, 3);
  ctx.fillRect(2 + p.faceX * 3, -4 + p.faceY * 3, 3, 3);
  ctx.restore();
}

export function render(ctx, game) {
  const level = game.level;
  const def = level.def;
  const W = 960, H = 600;

  // Floor: bright checker tiles so guards read against it.
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 24; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#2a3352' : '#252d49';
      ctx.fillRect(x * 40, y * 40, 40, 40);
    }
  }
  // Lit pools from the lamps (safe to see, dangerous to be seen in).
  for (const l of def.lamps) {
    const grad = ctx.createRadialGradient(l.x, l.y, 10, l.x, l.y, l.r);
    grad.addColorStop(0, 'rgba(255,214,120,0.30)');
    grad.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd678';
    ctx.beginPath(); ctx.arc(l.x, l.y, 5, 0, Math.PI * 2); ctx.fill();
  }
  // Shadow veil over unlit floor.
  ctx.fillStyle = 'rgba(6,8,20,0.28)';
  ctx.fillRect(0, 0, W, H);
  for (const l of def.lamps) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const grad = ctx.createRadialGradient(l.x, l.y, 10, l.x, l.y, l.r);
    grad.addColorStop(0, 'rgba(0,0,0,0.9)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Exit: glowing green door with a bright arrow so the goal reads at a glance.
  const e = def.exit;
  ctx.fillStyle = '#123f22';
  ctx.fillRect(e.x, e.y, e.w, e.h);
  ctx.fillStyle = '#39d97a';
  ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);
  ctx.fillStyle = '#062b14';
  ctx.font = 'bold 13px Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT ➜', e.x + e.w / 2, e.y + e.h / 2 + 5);

  // Gems.
  for (const g of level.gems) {
    if (g.taken) continue;
    const bob = Math.sin(game.time * 3 + g.x) * 2;
    ctx.fillStyle = '#ff5fa2';
    ctx.beginPath();
    ctx.moveTo(g.x, g.y - 9 + bob);
    ctx.lineTo(g.x + 7, g.y + bob);
    ctx.lineTo(g.x, g.y + 9 + bob);
    ctx.lineTo(g.x - 7, g.y + bob);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ffd7ea'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  // Cover crates (hide behind these: they block vision cones).
  for (const c of def.cover) {
    ctx.fillStyle = '#7a5a2e';
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.fillStyle = '#8f6c38';
    ctx.fillRect(c.x + 5, c.y + 5, c.w - 10, c.h - 10);
    ctx.strokeStyle = '#4a3517';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x, c.y, c.w, c.h);
    ctx.beginPath();
    ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + c.w, c.y + c.h);
    ctx.moveTo(c.x + c.w, c.y); ctx.lineTo(c.x, c.y + c.h);
    ctx.stroke();
  }

  // Walls.
  for (const w of def.walls) {
    ctx.fillStyle = '#4c5878';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.fillStyle = '#67749c';
    ctx.fillRect(w.x + 2, w.y + 2, w.w - 4, Math.min(6, w.h - 4));
  }

  // Noise rings from running.
  for (const ring of game.noiseRings) {
    ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - ring.age / 0.6)})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r * (0.4 + ring.age), 0, Math.PI * 2); ctx.stroke();
  }

  for (const g of level.guards) drawGuard(ctx, g, level);
  drawPlayer(ctx, game.player);

  // Player in shadow? Show a small "HIDDEN" tag when fully out of sight.
  const lit = inLight(game.player.x, game.player.y, level);
  if (!lit && game.alert === 'UNSEEN') {
    ctx.fillStyle = '#9fd8ff';
    ctx.font = 'bold 12px Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IN SHADOW — HARD TO SPOT', game.player.x, game.player.y - 22);
  }
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(5,8,18,0.78)';
  ctx.fillRect(0, 0, 960, 600);
  ctx.textAlign = 'center';
  ctx.fillStyle = accent;
  ctx.font = 'bold 44px Verdana, sans-serif';
  ctx.fillText(title, 480, 190);
  ctx.fillStyle = '#e8edff';
  ctx.font = '18px Verdana, sans-serif';
  lines.forEach((line, i) => ctx.fillText(line, 480, 250 + i * 32));
}

export function renderMenu(ctx, game) {
  render(ctx, game);
  overlay(ctx, 'SHADOW VAULT', [
    'Sneak past the guards. Grab the gems. Reach the EXIT unseen.',
    'Vision cones see you — crates and shadow hide you.',
    'Running is loud: guards come to investigate the noise.',
    '',
    'Click START or press ENTER — Level 1/2/3 to pick a level',
  ], '#ffd678');
  ctx.fillStyle = '#39d97a';
  ctx.fillRect(380, 420, 200, 52);
  ctx.fillStyle = '#062b14';
  ctx.font = 'bold 22px Verdana, sans-serif';
  ctx.fillText('▶  START', 480, 455);
}

export function renderCaught(ctx, game) {
  render(ctx, game);
  overlay(ctx, 'CAUGHT!', [
    `A guard grabbed you on ${game.level.def.name}.`,
    `Score ${game.score} — ${game.gemsTaken} gems grabbed.`,
    '',
    'Press R or click to try again — sneak slower, use the shadow.',
  ], '#ff5566');
}

export function renderWin(ctx, game) {
  render(ctx, game);
  const bonus = Math.max(0, (game.level.def.par - Math.floor(game.elapsed)) * 10);
  overlay(ctx, 'CLEAN GETAWAY!', [
    `${game.level.def.name} cleared — ${game.gemsTaken}/${game.level.gems.length} gems.`,
    `Time ${formatTime(game.elapsed)} (par ${game.level.def.par}s) — time bonus +${bonus}.`,
    `Score ${game.score + bonus}.`,
    '',
    'Press N for the next level, R to replay, or click a level button.',
  ], '#39d97a');
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
