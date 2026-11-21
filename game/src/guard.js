// Guard AI: patrol waypoints, vision cones with line-of-sight, a detection
// meter (UNSEEN -> SUSPICIOUS -> SPOTTED), noise investigation and chase.

export const FOV = (Math.PI * 75) / 180; // 75-degree vision cone

function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export function blocksSight(x, y, level) {
  for (const w of level.def.walls) if (pointInRect(x, y, w)) return true;
  for (const c of level.def.cover) if (pointInRect(x, y, c)) return true;
  return false;
}

// Sampled line-of-sight: walls and crates block a guard's view.
export function hasLineOfSight(x1, y1, x2, y2, level) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(dist / 8));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (blocksSight(x1 + dx * t, y1 + dy * t, level)) return false;
  }
  return true;
}

export function inLight(x, y, level) {
  for (const l of level.def.lamps) {
    if (Math.hypot(x - l.x, y - l.y) < l.r) return true;
  }
  return false;
}

// Can this guard see the player right now? Returns a 0..1 visibility score.
export function guardSeesPlayer(guard, player, level) {
  const dx = player.x - guard.x, dy = player.y - guard.y;
  const dist = Math.hypot(dx, dy);
  let range = guard.range;
  if (player.sneaking) range *= 0.55;          // sneaking shrinks the cone
  if (!inLight(player.x, player.y, level)) range *= 0.7; // shadow hides you
  if (dist > range) return 0;
  let ang = Math.atan2(dy, dx) - guard.dir;
  while (ang > Math.PI) ang -= 2 * Math.PI;
  while (ang < -Math.PI) ang += 2 * Math.PI;
  if (Math.abs(ang) > FOV / 2) return 0;
  if (!hasLineOfSight(guard.x, guard.y, player.x, player.y, level)) return 0;
  // Closer and running = much more visible; lit floor adds more.
  let score = 1 - dist / range;
  if (player.running) score += 0.45;
  if (inLight(player.x, player.y, level)) score += 0.2;
  return Math.min(1, Math.max(0.15, score));
}

function moveToward(guard, tx, ty, speed, dt, level) {
  const dx = tx - guard.x, dy = ty - guard.y;
  const d = Math.hypot(dx, dy);
  if (d < 2) return true;
  const step = Math.min(d, speed * dt);
  const nx = guard.x + (dx / d) * step, ny = guard.y + (dy / d) * step;
  guard.dir = Math.atan2(dy, dx);
  if (!blocksSight(nx, guard.y, level)) guard.x = nx;
  if (!blocksSight(guard.x, ny, level)) guard.y = ny;
  return d <= step + 1;
}

export function updateGuard(guard, player, level, dt, events) {
  const seen = guardSeesPlayer(guard, player, level);
  if (seen > 0) {
    guard.meter += seen * dt * 95; // fast fill up close, slow at the edge
    guard.lastSeen = { x: player.x, y: player.y };
  } else {
    guard.meter -= dt * 28;
  }
  guard.meter = Math.max(0, Math.min(100, guard.meter));

  if (guard.meter >= 100 && guard.state !== 'chase') {
    guard.state = 'chase';
    guard.chaseTime = 4;
    events.push({ type: 'spotted', guard });
  } else if (guard.meter >= 35 && guard.state === 'patrol') {
    guard.state = 'investigate';
    guard.investigateHold = 2.5;
    guard.investigate = guard.lastSeen ? { ...guard.lastSeen } : { x: guard.x, y: guard.y };
    events.push({ type: 'suspicious', guard });
  }

  if (guard.state === 'chase') {
    guard.chaseTime -= dt;
    const caught = moveToward(guard, player.x, player.y, guard.speed * 2.1, dt, level);
    if (Math.hypot(player.x - guard.x, player.y - guard.y) < 26) {
      events.push({ type: 'caught', guard });
    }
    if (guard.chaseTime <= 0 && guard.meter < 60) {
      guard.state = 'investigate';
      guard.investigate = guard.lastSeen ? { ...guard.lastSeen } : { x: guard.x, y: guard.y };
    }
    return;
  }

  if (guard.state === 'investigate') {
    const target = guard.investigate;
    guard.investigateHold = Math.max(0, (guard.investigateHold || 0) - dt);
    if (target) {
      const arrived = moveToward(guard, target.x, target.y, guard.speed * 1.5, dt, level);
      if (arrived) {
        guard.pause += dt;
        guard.dir += dt * 1.6; // look around
        if (guard.pause > 2.2) {
          guard.state = 'patrol';
          guard.pause = 0;
          guard.investigate = null;
        }
      }
    }
    if (guard.investigateHold <= 0 && guard.meter < 20) { guard.state = 'patrol'; guard.investigate = null; }
    return;
  }

  // patrol: walk waypoints, pause and scan at each one
  const wp = guard.waypoints[guard.wp];
  if (guard.pause > 0) {
    guard.pause -= dt;
    guard.dir += dt * 0.9;
    if (guard.pause <= 0) guard.wp = (guard.wp + 1) % guard.waypoints.length;
    return;
  }
  const arrived = moveToward(guard, wp[0], wp[1], guard.speed, dt, level);
  if (arrived) guard.pause = 1.1;
}

// A running player makes noise: guards inside the ring investigate the spot.
export function hearNoise(level, x, y, radius, events) {
  for (const guard of level.guards) {
    if (guard.state === 'chase') continue;
    if (Math.hypot(guard.x - x, guard.y - y) < radius) {
      if (guard.state === 'patrol') {
        guard.state = 'investigate';
        guard.meter = Math.max(guard.meter, 45); // a heard noise keeps them suspicious
        guard.investigateHold = 3;
        guard.investigate = { x, y };
        events.push({ type: 'noise', guard });
      } else if (guard.state === 'investigate') {
        guard.investigate = { x, y };
        guard.investigateHold = 3;
      }
    }
  }
}
