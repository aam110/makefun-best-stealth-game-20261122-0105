// Level layouts for Shadow Vault: walls block sight and movement, crates are
// low cover that block a guard's vision cone, lamps paint lit floor (you are
// easier to spot there), dark floor is shadow (harder to spot you in).
// Every level: reach the green EXIT with as many gems as you can, unseen.

export const LEVELS = [
  {
    name: 'LEVEL 1 — THE GALLERY',
    par: 45,
    player: { x: 70, y: 300 },
    exit: { x: 880, y: 300, w: 56, h: 56 },
    walls: [
      { x: 0, y: 0, w: 960, h: 24 }, { x: 0, y: 576, w: 960, h: 24 },
      { x: 0, y: 0, w: 24, h: 600 }, { x: 936, y: 0, w: 24, h: 600 },
      { x: 220, y: 120, w: 24, h: 180 }, { x: 220, y: 380, w: 24, h: 100 },
      { x: 480, y: 60, w: 24, h: 160 }, { x: 480, y: 380, w: 24, h: 140 },
      { x: 700, y: 180, w: 24, h: 200 },
    ],
    cover: [
      { x: 320, y: 120, w: 64, h: 64 }, { x: 320, y: 420, w: 64, h: 64 },
      { x: 560, y: 280, w: 64, h: 64 }, { x: 760, y: 90, w: 64, h: 64 },
      { x: 760, y: 450, w: 64, h: 64 },
    ],
    lamps: [
      { x: 180, y: 300, r: 130 }, { x: 520, y: 140, r: 120 },
      { x: 520, y: 470, r: 120 }, { x: 820, y: 300, r: 130 },
    ],
    gems: [
      { x: 360, y: 90 }, { x: 360, y: 510 }, { x: 620, y: 300 },
      { x: 800, y: 540 }, { x: 880, y: 70 },
    ],
    guards: [
      { x: 400, y: 200, speed: 55, range: 175, waypoints: [[400, 200], [400, 420], [620, 420], [620, 200]] },
      { x: 780, y: 420, speed: 48, range: 165, waypoints: [[780, 420], [780, 140], [620, 140]] },
    ],
  },
  {
    name: 'LEVEL 2 — THE VAULT FLOOR',
    par: 60,
    player: { x: 70, y: 80 },
    exit: { x: 880, y: 520, w: 56, h: 56 },
    walls: [
      { x: 0, y: 0, w: 960, h: 24 }, { x: 0, y: 576, w: 960, h: 24 },
      { x: 0, y: 0, w: 24, h: 600 }, { x: 936, y: 0, w: 24, h: 600 },
      { x: 180, y: 200, w: 200, h: 24 }, { x: 580, y: 200, w: 200, h: 24 },
      { x: 180, y: 380, w: 200, h: 24 }, { x: 580, y: 380, w: 200, h: 24 },
      { x: 460, y: 60, w: 24, h: 120 }, { x: 460, y: 420, w: 24, h: 120 },
    ],
    cover: [
      { x: 120, y: 280, w: 64, h: 64 }, { x: 400, y: 280, w: 64, h: 64 },
      { x: 660, y: 280, w: 64, h: 64 }, { x: 280, y: 470, w: 64, h: 64 },
      { x: 640, y: 70, w: 64, h: 64 }, { x: 830, y: 280, w: 64, h: 64 },
    ],
    lamps: [
      { x: 280, y: 120, r: 120 }, { x: 680, y: 120, r: 120 },
      { x: 280, y: 480, r: 120 }, { x: 680, y: 480, r: 120 }, { x: 480, y: 300, r: 140 },
    ],
    gems: [
      { x: 90, y: 500 }, { x: 300, y: 300 }, { x: 480, y: 90 },
      { x: 660, y: 300 }, { x: 880, y: 80 }, { x: 480, y: 510 },
    ],
    guards: [
      { x: 280, y: 160, speed: 62, range: 180, waypoints: [[280, 160], [680, 160], [680, 240], [280, 240]] },
      { x: 680, y: 440, speed: 58, range: 180, waypoints: [[680, 440], [280, 440], [280, 360], [680, 360]] },
      { x: 480, y: 300, speed: 45, range: 170, waypoints: [[480, 300], [480, 120], [480, 480]] },
    ],
  },
  {
    name: 'LEVEL 3 — THE INNER SANCTUM',
    par: 75,
    player: { x: 70, y: 300 },
    exit: { x: 880, y: 300, w: 56, h: 56 },
    walls: [
      { x: 0, y: 0, w: 960, h: 24 }, { x: 0, y: 576, w: 960, h: 24 },
      { x: 0, y: 0, w: 24, h: 600 }, { x: 936, y: 0, w: 24, h: 600 },
      { x: 200, y: 0, w: 24, h: 220 }, { x: 200, y: 380, w: 24, h: 220 },
      { x: 430, y: 140, w: 24, h: 320 }, { x: 660, y: 0, w: 24, h: 220 },
      { x: 660, y: 380, w: 24, h: 220 }, { x: 760, y: 260, w: 120, h: 24 },
    ],
    cover: [
      { x: 110, y: 120, w: 64, h: 64 }, { x: 110, y: 420, w: 64, h: 64 },
      { x: 300, y: 270, w: 64, h: 64 }, { x: 520, y: 90, w: 64, h: 64 },
      { x: 520, y: 450, w: 64, h: 64 }, { x: 760, y: 90, w: 64, h: 64 },
      { x: 760, y: 460, w: 64, h: 64 },
    ],
    lamps: [
      { x: 320, y: 150, r: 120 }, { x: 320, y: 450, r: 120 },
      { x: 560, y: 300, r: 130 }, { x: 800, y: 150, r: 120 }, { x: 800, y: 450, r: 120 },
    ],
    gems: [
      { x: 130, y: 300 }, { x: 320, y: 540 }, { x: 560, y: 170 },
      { x: 560, y: 430 }, { x: 720, y: 300 }, { x: 880, y: 70 }, { x: 880, y: 540 },
    ],
    guards: [
      { x: 320, y: 220, speed: 70, range: 190, waypoints: [[320, 220], [320, 380], [560, 380], [560, 220]] },
      { x: 720, y: 140, speed: 66, range: 185, waypoints: [[720, 140], [720, 460], [860, 460], [860, 140]] },
      { x: 130, y: 520, speed: 60, range: 175, waypoints: [[130, 520], [130, 80], [130, 300]] },
      { x: 560, y: 300, speed: 50, range: 180, waypoints: [[560, 300], [760, 300], [560, 300], [360, 300]] },
    ],
  },
];

export function buildLevel(index) {
  const def = LEVELS[index % LEVELS.length];
  return {
    def,
    index,
    gems: def.gems.map((g) => ({ ...g, taken: false })),
    guards: def.guards.map((g) => ({
      x: g.x, y: g.y, speed: g.speed, range: g.range,
      waypoints: g.waypoints.map((w) => [...w]),
      wp: 0, dir: 0, state: 'patrol', meter: 0,
      lastSeen: null, investigate: null, investigateHold: 0, chaseTime: 0, pause: 0,
    })),
  };
}
