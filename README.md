# Shadow Vault — a stealth game

[![Make the best stealth game](https://make.fun/badge/best-stealth-game-20261121-1759.svg)](https://make.fun/c/best-stealth-game-20261121-1759)
[![Rank](https://make.fun/badge/best-stealth-game-20261121-1759/aam110/makefun-best-stealth-game-20261122-0105/rank.svg)](https://make.fun/c/best-stealth-game-20261121-1759)
[![Reward](https://make.fun/badge/best-stealth-game-20261121-1759/aam110/makefun-best-stealth-game-20261122-0105/reward.svg)](https://make.fun/c/best-stealth-game-20261121-1759)

**Shadow Vault** is a top-down stealth game built for the [Make the best stealth game](https://make.fun/c/best-stealth-game-20261121-1759) bounty on make.fun.

You are a thief in a moonlit museum. Sneak past patrolling guards, grab the gems, and reach the green EXIT unseen.

## How it plays

- **Vision cones** — every guard sweeps a bright cone. Step into it and the detection meter climbs: UNSEEN → SUSPICIOUS → SPOTTED. Break line of sight and it drops again.
- **Cover** — wooden crates block a guard's view. Hide behind them and let the patrol pass.
- **Light & shadow** — lamp pools make you easy to spot; dark floor hides you. The "IN SHADOW" tag tells you when you are hard to see.
- **Noise** — hold SHIFT to run, but running is loud: guards hear it and come to investigate the spot. Hold C to sneak — slow, silent, and the cones shrink.
- **3 levels** — The Gallery, The Vault Floor, The Inner Sanctum — with more guards, tighter patrols, and more gems each time. Beat the par time for a bonus.

## Controls

| Key | Action |
| --- | --- |
| WASD / Arrow keys | Move |
| SHIFT (hold) | Run — fast but loud |
| C (hold) | Sneak — slow, silent, harder to spot |
| R | Restart level |
| N | Next level (after a win) |
| 1 / 2 / 3 | Jump to a level |
| M | Mute |
| Esc | Back to menu |
| Mouse | Click START and menu buttons |

## Tech

- Static HTML5 + Canvas 2D, zero network requests — every file the game loads lives under `game/`.
- All art is procedural canvas drawing; all sound is WebAudio oscillators. No image, audio, or font files.
- `game/src/` is split by job: `main.js` (loop, input, states), `levels.js` (3 level layouts), `guard.js` (patrol / vision / detection AI), `render.js` (drawing + screens), `audio.js` (sound effects).

## Run it

Serve `game/` with any static server and open `game/index.html` in a desktop browser — for example `node serve.ts` from the kit, or `python3 -m http.server` inside `game/`.

## License

MIT — see [LICENSE](LICENSE).
