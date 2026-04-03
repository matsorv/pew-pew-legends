# Pew Pew Legends Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 2D local multiplayer arena shooter in the browser where two players share a keyboard and fight across best-of rounds.

**Architecture:** Phaser.js 3 with Arcade Physics. Game logic lives in pure classes (`GameState`, `PlayerState`, `WeaponSystem`, `ArenaGenerator`) decoupled from Phaser rendering. Phaser scenes read state and draw. This separation enables future network multiplayer.

**Tech Stack:** Phaser.js 3, Vite (dev server + bundler), vanilla JavaScript (ES modules)

---

## File Structure

```
pew-pew-legends/
├── index.html                  # Entry point, loads Phaser
├── vite.config.js              # Vite config
├── package.json
├── src/
│   ├── main.js                 # Phaser game config + launch
│   ├── config/
│   │   ├── controls.js         # Key bindings for P1 and P2
│   │   └── weapons.js          # Weapon stats (damage, fire rate, speed)
│   ├── state/
│   │   ├── GameState.js        # Match state: scores, round, players
│   │   ├── PlayerState.js      # Single player: hp, position, aim, weapon
│   │   └── ArenaGenerator.js   # Random obstacle placement
│   ├── scenes/
│   │   ├── BootScene.js        # Asset loading
│   │   ├── MenuScene.js        # Title + best-of selector
│   │   ├── GameScene.js        # Main gameplay rendering + input
│   │   ├── RoundEndScene.js    # Round result overlay
│   │   └── GameOverScene.js    # Match winner screen
│   ├── entities/
│   │   ├── Player.js           # Phaser sprite wrapping PlayerState
│   │   ├── Bullet.js           # Projectile sprite
│   │   └── Obstacle.js         # Crate/Wall/Platform sprite
│   └── ui/
│       ├── HealthBar.js        # Health bar above player + HUD
│       └── HUD.js              # Top-of-screen player info
└── tests/
    ├── state/
    │   ├── GameState.test.js
    │   ├── PlayerState.test.js
    │   └── ArenaGenerator.test.js
    └── config/
        └── weapons.test.js
```

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`

- [ ] **Step 1: Initialize project and install dependencies**

```bash
npm init -y
npm install phaser
npm install -D vite vitest
```

- [ ] **Step 2: Create vite.config.js**

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
  },
});
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pew Pew Legends</title>
  <style>
    * { margin: 0; padding: 0; }
    body { background: #0f0f23; overflow: hidden; }
    canvas { display: block; margin: 0 auto; }
  </style>
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create src/main.js with Phaser config**

```js
// src/main.js
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { RoundEndScene } from './scenes/RoundEndScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0f0f23',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, RoundEndScene, GameOverScene],
};

new Phaser.Game(config);
```

- [ ] **Step 5: Create stub scenes so the game boots**

Create all five scene files with minimal class stubs:

```js
// src/scenes/BootScene.js
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Assets loaded in Task 3
  }

  create() {
    this.scene.start('Menu');
  }
}
```

```js
// src/scenes/MenuScene.js
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.add.text(400, 250, 'PEW PEW LEGENDS', {
      fontSize: '48px',
      fill: '#4fc3f7',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(400, 350, 'Press ENTER to start', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Game');
    });
  }
}
```

```js
// src/scenes/GameScene.js
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.add.text(400, 300, 'Game Scene - TODO', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
```

```js
// src/scenes/RoundEndScene.js
import Phaser from 'phaser';

export class RoundEndScene extends Phaser.Scene {
  constructor() {
    super('RoundEnd');
  }

  create() {}
}
```

```js
// src/scenes/GameOverScene.js
import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {}
}
```

- [ ] **Step 6: Add npm scripts to package.json**

Add to `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 7: Run dev server and verify game boots**

```bash
npm run dev
```

Expected: Browser opens, dark background with "PEW PEW LEGENDS" title and "Press ENTER to start" text.

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js index.html src/
git commit -m "scaffold project with phaser and stub scenes"
```

---

### Task 2: Config — Weapon Stats and Controls

**Files:**
- Create: `src/config/weapons.js`
- Create: `src/config/controls.js`
- Create: `tests/config/weapons.test.js`

- [ ] **Step 1: Write weapon config tests**

```js
// tests/config/weapons.test.js
import { describe, it, expect } from 'vitest';
import { WEAPONS } from '../../src/config/weapons.js';

describe('WEAPONS config', () => {
  it('has three weapons', () => {
    expect(Object.keys(WEAPONS)).toEqual(['handgun', 'assaultRifle', 'sniperRifle']);
  });

  it('handgun does 10 damage and needs 10 hits to kill', () => {
    expect(WEAPONS.handgun.damage).toBe(10);
    expect(WEAPONS.handgun.fireRate).toBeGreaterThan(WEAPONS.assaultRifle.fireRate);
  });

  it('assault rifle has auto fire enabled', () => {
    expect(WEAPONS.assaultRifle.auto).toBe(true);
    expect(WEAPONS.assaultRifle.damage).toBe(10);
  });

  it('sniper rifle has headshot multiplier and charge delay', () => {
    expect(WEAPONS.sniperRifle.damage).toBe(33);
    expect(WEAPONS.sniperRifle.headshotDamage).toBe(100);
    expect(WEAPONS.sniperRifle.chargeDelay).toBeGreaterThan(0);
    expect(WEAPONS.sniperRifle.laser).toBe(true);
  });

  it('all weapons have bullet speed', () => {
    for (const weapon of Object.values(WEAPONS)) {
      expect(weapon.bulletSpeed).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — cannot find module `weapons.js`

- [ ] **Step 3: Implement weapons.js**

```js
// src/config/weapons.js
export const WEAPONS = {
  handgun: {
    name: 'Handgun',
    damage: 10,
    headshotDamage: 10,
    fireRate: 400,       // ms between shots
    bulletSpeed: 600,    // px/s
    auto: false,
    laser: false,
    chargeDelay: 0,
  },
  assaultRifle: {
    name: 'Assault Rifle',
    damage: 10,
    headshotDamage: 10,
    fireRate: 120,
    bulletSpeed: 700,
    auto: true,
    laser: false,
    chargeDelay: 0,
  },
  sniperRifle: {
    name: 'Sniper Rifle',
    damage: 33,
    headshotDamage: 100,
    fireRate: 1000,
    bulletSpeed: 1200,
    auto: false,
    laser: true,
    chargeDelay: 300,    // ms delay before shot fires
  },
};

export const WEAPON_ORDER = ['handgun', 'assaultRifle', 'sniperRifle'];
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All weapon tests PASS

- [ ] **Step 5: Create controls.js**

```js
// src/config/controls.js
export const PLAYER_CONTROLS = {
  player1: {
    left: 'A',
    right: 'D',
    aimUp: 'W',
    aimDown: 'S',
    jump: 'SHIFT',         // left shift
    shoot: 'CTRL',         // left ctrl (handled via event.location)
    weaponPrev: 'Q',
    weaponNext: 'E',
  },
  player2: {
    left: 'LEFT',
    right: 'RIGHT',
    aimUp: 'UP',
    aimDown: 'DOWN',
    jump: 'SHIFT',         // right shift (handled via event.location)
    shoot: 'CTRL',         // right ctrl (handled via event.location)
    weaponPrev: 'COMMA',
    weaponNext: 'PERIOD',
  },
};

// KeyboardEvent.location values for distinguishing left/right shift/ctrl
export const KEY_LOCATION = {
  LEFT: 1,
  RIGHT: 2,
};
```

- [ ] **Step 6: Commit**

```bash
git add src/config/ tests/
git commit -m "add weapon stats and control config"
```

---

### Task 3: State — PlayerState

**Files:**
- Create: `src/state/PlayerState.js`
- Create: `tests/state/PlayerState.test.js`

- [ ] **Step 1: Write PlayerState tests**

```js
// tests/state/PlayerState.test.js
import { describe, it, expect } from 'vitest';
import { PlayerState } from '../../src/state/PlayerState.js';

describe('PlayerState', () => {
  it('initializes with 100 hp and default weapon', () => {
    const player = new PlayerState(1, 100, 400);
    expect(player.hp).toBe(100);
    expect(player.currentWeapon).toBe('handgun');
    expect(player.x).toBe(100);
    expect(player.y).toBe(400);
    expect(player.aimAngle).toBe(0);
  });

  it('takes body damage', () => {
    const player = new PlayerState(1, 0, 0);
    player.takeDamage(10, false);
    expect(player.hp).toBe(90);
  });

  it('takes headshot damage', () => {
    const player = new PlayerState(1, 0, 0);
    player.takeDamage(33, true);
    expect(player.hp).toBe(67);
  });

  it('hp does not go below 0', () => {
    const player = new PlayerState(1, 0, 0);
    player.takeDamage(150, false);
    expect(player.hp).toBe(0);
  });

  it('isDead returns true when hp is 0', () => {
    const player = new PlayerState(1, 0, 0);
    player.takeDamage(100, false);
    expect(player.isDead()).toBe(true);
  });

  it('cycles weapons forward', () => {
    const player = new PlayerState(1, 0, 0);
    expect(player.currentWeapon).toBe('handgun');
    player.switchWeapon(1);
    expect(player.currentWeapon).toBe('assaultRifle');
    player.switchWeapon(1);
    expect(player.currentWeapon).toBe('sniperRifle');
    player.switchWeapon(1);
    expect(player.currentWeapon).toBe('handgun');
  });

  it('cycles weapons backward', () => {
    const player = new PlayerState(1, 0, 0);
    player.switchWeapon(-1);
    expect(player.currentWeapon).toBe('sniperRifle');
  });

  it('adjusts aim angle within bounds', () => {
    const player = new PlayerState(1, 0, 0);
    player.adjustAim(-Math.PI / 4);
    expect(player.aimAngle).toBeCloseTo(-Math.PI / 4);
  });

  it('clamps aim angle to -PI/2 and PI/2', () => {
    const player = new PlayerState(1, 0, 0);
    player.adjustAim(-Math.PI);
    expect(player.aimAngle).toBeCloseTo(-Math.PI / 2);
    player.adjustAim(Math.PI * 2);
    expect(player.aimAngle).toBeCloseTo(Math.PI / 2);
  });

  it('resets to full state', () => {
    const player = new PlayerState(1, 50, 300);
    player.takeDamage(40, false);
    player.switchWeapon(1);
    player.reset(200, 400);
    expect(player.hp).toBe(100);
    expect(player.currentWeapon).toBe('handgun');
    expect(player.x).toBe(200);
    expect(player.y).toBe(400);
    expect(player.aimAngle).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — cannot find module `PlayerState.js`

- [ ] **Step 3: Implement PlayerState**

```js
// src/state/PlayerState.js
import { WEAPON_ORDER } from '../config/weapons.js';

export class PlayerState {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.weaponIndex = 0;
    this.aimAngle = 0; // 0 = horizontal, negative = up, positive = down
    this.lastFireTime = 0;
  }

  get currentWeapon() {
    return WEAPON_ORDER[this.weaponIndex];
  }

  takeDamage(amount, isHeadshot) {
    this.hp = Math.max(0, this.hp - amount);
  }

  isDead() {
    return this.hp <= 0;
  }

  switchWeapon(direction) {
    this.weaponIndex = (this.weaponIndex + direction + WEAPON_ORDER.length) % WEAPON_ORDER.length;
  }

  adjustAim(delta) {
    this.aimAngle = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.aimAngle + delta));
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.weaponIndex = 0;
    this.aimAngle = 0;
    this.lastFireTime = 0;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All PlayerState tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/state/PlayerState.js tests/state/PlayerState.test.js
git commit -m "add PlayerState with hp, weapons, and aim"
```

---

### Task 4: State — GameState

**Files:**
- Create: `src/state/GameState.js`
- Create: `tests/state/GameState.test.js`

- [ ] **Step 1: Write GameState tests**

```js
// tests/state/GameState.test.js
import { describe, it, expect } from 'vitest';
import { GameState } from '../../src/state/GameState.js';

describe('GameState', () => {
  it('initializes with two players and score 0-0', () => {
    const state = new GameState(3);
    expect(state.scores).toEqual([0, 0]);
    expect(state.roundsToWin).toBe(2);
    expect(state.currentRound).toBe(1);
    expect(state.player1).toBeDefined();
    expect(state.player2).toBeDefined();
  });

  it('best-of-5 requires 3 wins', () => {
    const state = new GameState(5);
    expect(state.roundsToWin).toBe(3);
  });

  it('registers a round win', () => {
    const state = new GameState(3);
    state.winRound(0);
    expect(state.scores).toEqual([1, 0]);
    expect(state.currentRound).toBe(2);
  });

  it('detects match winner', () => {
    const state = new GameState(3);
    expect(state.getMatchWinner()).toBe(null);
    state.winRound(0);
    expect(state.getMatchWinner()).toBe(null);
    state.winRound(0);
    expect(state.getMatchWinner()).toBe(0);
  });

  it('resets round state without resetting scores', () => {
    const state = new GameState(3);
    state.player1.takeDamage(50, false);
    state.winRound(0);
    state.resetRound(2400);
    expect(state.player1.hp).toBe(100);
    expect(state.player2.hp).toBe(100);
    expect(state.scores).toEqual([1, 0]);
  });

  it('full reset clears everything', () => {
    const state = new GameState(3);
    state.winRound(1);
    state.winRound(1);
    state.fullReset(3);
    expect(state.scores).toEqual([0, 0]);
    expect(state.currentRound).toBe(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — cannot find module `GameState.js`

- [ ] **Step 3: Implement GameState**

```js
// src/state/GameState.js
import { PlayerState } from './PlayerState.js';

export class GameState {
  constructor(bestOf) {
    this.bestOf = bestOf;
    this.roundsToWin = Math.ceil(bestOf / 2);
    this.scores = [0, 0];
    this.currentRound = 1;
    this.arenaWidth = 2400;
    this.player1 = new PlayerState(1, 200, 400);
    this.player2 = new PlayerState(2, this.arenaWidth - 200, 400);
  }

  winRound(playerIndex) {
    this.scores[playerIndex]++;
    this.currentRound++;
  }

  getMatchWinner() {
    if (this.scores[0] >= this.roundsToWin) return 0;
    if (this.scores[1] >= this.roundsToWin) return 1;
    return null;
  }

  resetRound(arenaWidth) {
    this.arenaWidth = arenaWidth || this.arenaWidth;
    this.player1.reset(200, 400);
    this.player2.reset(this.arenaWidth - 200, 400);
  }

  fullReset(bestOf) {
    this.bestOf = bestOf;
    this.roundsToWin = Math.ceil(bestOf / 2);
    this.scores = [0, 0];
    this.currentRound = 1;
    this.player1.reset(200, 400);
    this.player2.reset(this.arenaWidth - 200, 400);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All GameState tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/state/GameState.js tests/state/GameState.test.js
git commit -m "add GameState with round and match tracking"
```

---

### Task 5: State — ArenaGenerator

**Files:**
- Create: `src/state/ArenaGenerator.js`
- Create: `tests/state/ArenaGenerator.test.js`

- [ ] **Step 1: Write ArenaGenerator tests**

```js
// tests/state/ArenaGenerator.test.js
import { describe, it, expect } from 'vitest';
import { ArenaGenerator } from '../../src/state/ArenaGenerator.js';

describe('ArenaGenerator', () => {
  it('generates obstacles', () => {
    const obstacles = ArenaGenerator.generate(2400);
    expect(obstacles.length).toBeGreaterThan(0);
  });

  it('each obstacle has type, x, y, width, height, hp', () => {
    const obstacles = ArenaGenerator.generate(2400);
    for (const obs of obstacles) {
      expect(['crate', 'wall', 'platform']).toContain(obs.type);
      expect(typeof obs.x).toBe('number');
      expect(typeof obs.y).toBe('number');
      expect(typeof obs.width).toBe('number');
      expect(typeof obs.height).toBe('number');
      expect(typeof obs.hp).toBe('number');
    }
  });

  it('crates have 50 hp, walls have 150 hp, platforms are indestructible', () => {
    const obstacles = ArenaGenerator.generate(2400);
    for (const obs of obstacles) {
      if (obs.type === 'crate') expect(obs.hp).toBe(50);
      if (obs.type === 'wall') expect(obs.hp).toBe(150);
      if (obs.type === 'platform') expect(obs.hp).toBe(Infinity);
    }
  });

  it('no obstacles in spawn zones (first and last 300px)', () => {
    for (let i = 0; i < 20; i++) {
      const obstacles = ArenaGenerator.generate(2400);
      for (const obs of obstacles) {
        expect(obs.x).toBeGreaterThanOrEqual(300);
        expect(obs.x + obs.width).toBeLessThanOrEqual(2100);
      }
    }
  });

  it('generates a mix of obstacle types', () => {
    const obstacles = ArenaGenerator.generate(2400);
    const types = new Set(obstacles.map(o => o.type));
    expect(types.size).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — cannot find module `ArenaGenerator.js`

- [ ] **Step 3: Implement ArenaGenerator**

```js
// src/state/ArenaGenerator.js
const OBSTACLE_DEFS = {
  crate: { width: 48, height: 40, hp: 50 },
  wall: { width: 24, height: 80, hp: 150 },
  platform: { width: 96, height: 16, hp: Infinity },
};

const GROUND_Y = 500; // y position of ground surface

export class ArenaGenerator {
  static generate(arenaWidth) {
    const spawnMargin = 300;
    const playAreaStart = spawnMargin;
    const playAreaEnd = arenaWidth - spawnMargin;
    const obstacles = [];

    // Place 3-5 crates
    const crateCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < crateCount; i++) {
      const def = OBSTACLE_DEFS.crate;
      const x = playAreaStart + Math.random() * (playAreaEnd - playAreaStart - def.width);
      obstacles.push({
        type: 'crate',
        x: Math.round(x),
        y: GROUND_Y - def.height,
        width: def.width,
        height: def.height,
        hp: def.hp,
      });
    }

    // Place 2-3 walls
    const wallCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < wallCount; i++) {
      const def = OBSTACLE_DEFS.wall;
      const x = playAreaStart + Math.random() * (playAreaEnd - playAreaStart - def.width);
      obstacles.push({
        type: 'wall',
        x: Math.round(x),
        y: GROUND_Y - def.height,
        width: def.width,
        height: def.height,
        hp: def.hp,
      });
    }

    // Place 2-3 platforms
    const platCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < platCount; i++) {
      const def = OBSTACLE_DEFS.platform;
      const x = playAreaStart + Math.random() * (playAreaEnd - playAreaStart - def.width);
      const y = GROUND_Y - 120 - Math.random() * 100; // floating above ground
      obstacles.push({
        type: 'platform',
        x: Math.round(x),
        y: Math.round(y),
        width: def.width,
        height: def.height,
        hp: def.hp,
      });
    }

    return obstacles;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All ArenaGenerator tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/state/ArenaGenerator.js tests/state/ArenaGenerator.test.js
git commit -m "add arena generator with random obstacle placement"
```

---

### Task 6: BootScene — Generate Pixel Art Assets

**Files:**
- Modify: `src/scenes/BootScene.js`

The game uses programmatically generated pixel art — no external image files needed. We generate textures in BootScene using Phaser's Graphics API.

- [ ] **Step 1: Implement BootScene with generated assets**

```js
// src/scenes/BootScene.js
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.generatePlayerSprite('player1', 0x4fc3f7, 0x0288d1);
    this.generatePlayerSprite('player2', 0xef5350, 0xc62828);
    this.generateBullet();
    this.generateObstacles();
    this.scene.start('Menu');
  }

  generatePlayerSprite(key, fillColor, outlineColor) {
    const g = this.add.graphics();

    // Head (16x16 at top center)
    g.fillStyle(fillColor);
    g.fillRect(8, 0, 16, 16);
    g.lineStyle(2, outlineColor);
    g.strokeRect(8, 0, 16, 16);

    // Body (20x16 below head)
    g.fillRect(6, 16, 20, 16);
    g.strokeRect(6, 16, 20, 16);

    // Left leg
    g.fillRect(8, 32, 8, 14);
    g.strokeRect(8, 32, 8, 14);

    // Right leg
    g.fillRect(18, 32, 8, 14);
    g.strokeRect(18, 32, 8, 14);

    g.generateTexture(key, 32, 48);
    g.destroy();
  }

  generateBullet() {
    const g = this.add.graphics();
    g.fillStyle(0xffeb3b);
    g.fillRect(0, 0, 8, 4);
    g.generateTexture('bullet', 8, 4);
    g.destroy();
  }

  generateObstacles() {
    // Crate
    const crate = this.add.graphics();
    crate.fillStyle(0x795548);
    crate.fillRect(0, 0, 48, 40);
    crate.lineStyle(2, 0x5d4037);
    crate.strokeRect(0, 0, 48, 40);
    crate.lineBetween(0, 0, 48, 40);
    crate.lineBetween(48, 0, 0, 40);
    crate.generateTexture('crate', 48, 40);
    crate.destroy();

    // Wall
    const wall = this.add.graphics();
    wall.fillStyle(0x546e7a);
    wall.fillRect(0, 0, 24, 80);
    wall.lineStyle(2, 0x37474f);
    wall.strokeRect(0, 0, 24, 80);
    wall.lineBetween(0, 26, 24, 26);
    wall.lineBetween(0, 53, 24, 53);
    wall.generateTexture('wall', 24, 80);
    wall.destroy();

    // Platform
    const plat = this.add.graphics();
    plat.fillStyle(0x78909c);
    plat.fillRect(0, 0, 96, 16);
    plat.lineStyle(2, 0x546e7a);
    plat.strokeRect(0, 0, 96, 16);
    plat.generateTexture('platform', 96, 16);
    plat.destroy();

    // Ground tile
    const ground = this.add.graphics();
    ground.fillStyle(0x2e7d32);
    ground.fillRect(0, 0, 64, 64);
    ground.lineStyle(1, 0x1b5e20);
    ground.lineBetween(0, 0, 64, 0);
    ground.generateTexture('ground', 64, 64);
    ground.destroy();
  }
}
```

- [ ] **Step 2: Run dev server and verify assets generate**

```bash
npm run dev
```

Expected: Game boots to Menu without errors. No visible change yet (assets are in memory, not displayed on MenuScene).

- [ ] **Step 3: Commit**

```bash
git add src/scenes/BootScene.js
git commit -m "generate pixel art assets in boot scene"
```

---

### Task 7: MenuScene — Title and Best-of Selector

**Files:**
- Modify: `src/scenes/MenuScene.js`

- [ ] **Step 1: Implement MenuScene with best-of selector**

```js
// src/scenes/MenuScene.js
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const centerX = 400;

    // Title
    this.add.text(centerX, 150, 'PEW PEW LEGENDS', {
      fontSize: '48px',
      fill: '#4fc3f7',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, 210, '2 Player Arena Shooter', {
      fontSize: '18px',
      fill: '#aaaaaa',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Best-of selector
    this.bestOf = 3;

    this.add.text(centerX, 320, 'ROUNDS', {
      fontSize: '16px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.bestOfText = this.add.text(centerX, 360, 'Best of 3', {
      fontSize: '28px',
      fill: '#ff9800',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 400, '← →  to change', {
      fontSize: '14px',
      fill: '#666666',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Start prompt
    this.add.text(centerX, 490, 'Press ENTER to start', {
      fontSize: '22px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Controls hint
    this.add.text(centerX, 550, 'P1: WASD + Shift/Ctrl + Q/E  |  P2: Arrows + Shift/Ctrl + ,/.', {
      fontSize: '11px',
      fill: '#555555',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Input
    this.input.keyboard.on('keydown-LEFT', () => {
      this.bestOf = 3;
      this.bestOfText.setText('Best of 3');
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
      this.bestOf = 5;
      this.bestOfText.setText('Best of 5');
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Game', { bestOf: this.bestOf });
    });
  }
}
```

- [ ] **Step 2: Run dev server and verify menu**

```bash
npm run dev
```

Expected: Title screen shows with "PEW PEW LEGENDS", best-of selector toggles between 3 and 5 with arrow keys, ENTER starts game.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/MenuScene.js
git commit -m "add menu with best-of selector"
```

---

### Task 8: GameScene — Arena, Ground, Camera

**Files:**
- Modify: `src/scenes/GameScene.js`
- Create: `src/entities/Obstacle.js`

- [ ] **Step 1: Create Obstacle entity**

```js
// src/entities/Obstacle.js
import Phaser from 'phaser';

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, config.x + config.width / 2, config.y + config.height / 2, config.type);
    this.obstacleType = config.type;
    this.hp = config.hp;
    this.maxHp = config.hp;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.body.setSize(config.width, config.height);
    this.setDisplaySize(config.width, config.height);
  }

  takeDamage(amount) {
    if (this.hp === Infinity) return false; // platforms are indestructible
    this.hp -= amount;
    // Flash white on hit
    this.setTint(0xffffff);
    this.scene.time.delayedCall(50, () => {
      this.clearTint();
    });
    if (this.hp <= 0) {
      this.destroy();
      return true; // destroyed
    }
    return false;
  }
}
```

- [ ] **Step 2: Implement GameScene with arena and camera**

```js
// src/scenes/GameScene.js
import Phaser from 'phaser';
import { GameState } from '../state/GameState.js';
import { ArenaGenerator } from '../state/ArenaGenerator.js';
import { Obstacle } from '../entities/Obstacle.js';

const ARENA_WIDTH = 2400;
const ARENA_HEIGHT = 600;
const GROUND_Y = 500;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.bestOf = data.bestOf || 3;
  }

  create() {
    this.gameState = new GameState(this.bestOf);

    // Sky background
    this.cameras.main.setBackgroundColor('#0f0f23');

    // Ground
    this.groundGroup = this.physics.add.staticGroup();
    for (let x = 0; x < ARENA_WIDTH; x += 64) {
      const tile = this.groundGroup.create(x + 32, GROUND_Y + 32, 'ground');
      tile.setDisplaySize(64, 64);
      tile.refreshBody();
    }

    // Obstacles
    this.obstacleGroup = this.physics.add.staticGroup();
    const obstacleConfigs = ArenaGenerator.generate(ARENA_WIDTH);
    this.obstacles = obstacleConfigs.map(config => {
      const obs = new Obstacle(this, config);
      this.obstacleGroup.add(obs);
      return obs;
    });

    // World bounds
    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Camera
    this.cameras.main.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Placeholder text (will be replaced when players are added)
    this.add.text(ARENA_WIDTH / 2, 300, 'Arena loaded — players next', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
```

- [ ] **Step 3: Run dev server and verify arena**

```bash
npm run dev
```

Expected: Press ENTER on menu → GameScene shows green ground tiles spanning the arena, obstacles (crates, walls, platforms) scattered in the middle. Camera shows left portion of arena.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/GameScene.js src/entities/Obstacle.js
git commit -m "add game arena with ground and obstacles"
```

---

### Task 9: Player Entity — Movement, Jump, Aim

**Files:**
- Create: `src/entities/Player.js`
- Modify: `src/scenes/GameScene.js`

- [ ] **Step 1: Create Player entity**

```js
// src/entities/Player.js
import Phaser from 'phaser';
import { WEAPONS } from '../config/weapons.js';

const AIM_SPEED = 2.5; // radians per second
const MOVE_SPEED = 250;
const JUMP_VELOCITY = -450;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, playerState, textureKey) {
    super(scene, playerState.x, playerState.y, textureKey);
    this.playerState = playerState;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setSize(24, 46);
    this.body.setOffset(4, 2);

    // Aim line graphics
    this.aimLine = scene.add.graphics();

    // Health bar graphics
    this.healthBar = scene.add.graphics();

    // Facing direction: 1 = right, -1 = left
    this.facing = playerState.id === 1 ? 1 : -1;
  }

  handleInput(keys, delta) {
    const state = this.playerState;
    const dt = delta / 1000;

    // Movement
    if (keys.left.isDown) {
      this.setVelocityX(-MOVE_SPEED);
      this.facing = -1;
    } else if (keys.right.isDown) {
      this.setVelocityX(MOVE_SPEED);
      this.facing = 1;
    } else {
      this.setVelocityX(0);
    }

    // Jump
    if (keys.jump.isDown && this.body.blocked.down) {
      this.setVelocityY(JUMP_VELOCITY);
    }

    // Aim
    if (keys.aimUp.isDown) {
      state.adjustAim(-AIM_SPEED * dt);
    }
    if (keys.aimDown.isDown) {
      state.adjustAim(AIM_SPEED * dt);
    }

    // Sync position to state
    state.x = this.x;
    state.y = this.y;
  }

  drawAimLine() {
    this.aimLine.clear();
    const angle = this.playerState.aimAngle;
    const length = 60;
    const startX = this.x + this.facing * 12;
    const startY = this.y - 8;
    const endX = startX + Math.cos(angle) * length * this.facing;
    const endY = startY + Math.sin(angle) * length;

    const weapon = WEAPONS[this.playerState.currentWeapon];
    const color = weapon.laser ? 0xff0000 : 0xffffff;
    const alpha = weapon.laser ? 0.8 : 0.3;

    this.aimLine.lineStyle(1, color, alpha);
    this.aimLine.lineBetween(startX, startY, endX, endY);
  }

  drawHealthBar() {
    this.healthBar.clear();
    const barWidth = 36;
    const barHeight = 5;
    const x = this.x - barWidth / 2;
    const y = this.y - 35;
    const hpRatio = this.playerState.hp / 100;

    // Background
    this.healthBar.fillStyle(0x333333);
    this.healthBar.fillRect(x, y, barWidth, barHeight);

    // Health fill
    const color = hpRatio > 0.5 ? 0x4caf50 : hpRatio > 0.25 ? 0xff9800 : 0xf44336;
    this.healthBar.fillStyle(color);
    this.healthBar.fillRect(x, y, barWidth * hpRatio, barHeight);
  }

  updateVisuals() {
    this.setFlipX(this.facing === -1);
    this.drawAimLine();
    this.drawHealthBar();
  }

  cleanup() {
    this.aimLine.destroy();
    this.healthBar.destroy();
  }
}
```

- [ ] **Step 2: Add players to GameScene**

Update `src/scenes/GameScene.js` — replace the create method and add update:

```js
// src/scenes/GameScene.js
import Phaser from 'phaser';
import { GameState } from '../state/GameState.js';
import { ArenaGenerator } from '../state/ArenaGenerator.js';
import { Obstacle } from '../entities/Obstacle.js';
import { Player } from '../entities/Player.js';
import { KEY_LOCATION } from '../config/controls.js';

const ARENA_WIDTH = 2400;
const ARENA_HEIGHT = 600;
const GROUND_Y = 500;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.bestOf = data.bestOf || 3;
  }

  create() {
    this.gameState = new GameState(this.bestOf);

    this.cameras.main.setBackgroundColor('#0f0f23');

    // Ground
    this.groundGroup = this.physics.add.staticGroup();
    for (let x = 0; x < ARENA_WIDTH; x += 64) {
      const tile = this.groundGroup.create(x + 32, GROUND_Y + 32, 'ground');
      tile.setDisplaySize(64, 64);
      tile.refreshBody();
    }

    // Obstacles
    this.obstacleGroup = this.physics.add.staticGroup();
    const obstacleConfigs = ArenaGenerator.generate(ARENA_WIDTH);
    this.obstacles = obstacleConfigs.map(config => {
      const obs = new Obstacle(this, config);
      this.obstacleGroup.add(obs);
      return obs;
    });

    // Players
    this.player1 = new Player(this, this.gameState.player1, 'player1');
    this.player2 = new Player(this, this.gameState.player2, 'player2');

    // Player-ground collisions
    this.physics.add.collider(this.player1, this.groundGroup);
    this.physics.add.collider(this.player2, this.groundGroup);
    this.physics.add.collider(this.player1, this.obstacleGroup);
    this.physics.add.collider(this.player2, this.obstacleGroup);

    // World bounds
    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Camera follows midpoint
    this.cameras.main.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Input — P1 keys
    this.p1Keys = {
      left: this.input.keyboard.addKey('A'),
      right: this.input.keyboard.addKey('D'),
      aimUp: this.input.keyboard.addKey('W'),
      aimDown: this.input.keyboard.addKey('S'),
      jump: null,  // handled via raw event for left shift
      shoot: null, // handled via raw event for left ctrl
      weaponPrev: this.input.keyboard.addKey('Q'),
      weaponNext: this.input.keyboard.addKey('E'),
    };

    // P2 keys
    this.p2Keys = {
      left: this.input.keyboard.addKey('LEFT'),
      right: this.input.keyboard.addKey('RIGHT'),
      aimUp: this.input.keyboard.addKey('UP'),
      aimDown: this.input.keyboard.addKey('DOWN'),
      jump: null,
      shoot: null,
      weaponPrev: this.input.keyboard.addKey('COMMA'),
      weaponNext: this.input.keyboard.addKey('PERIOD'),
    };

    // Track left/right shift and ctrl separately via raw keyboard events
    this.rawKeys = {
      leftShift: false,
      rightShift: false,
      leftCtrl: false,
      rightCtrl: false,
    };

    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'Shift' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftShift = true;
      if (event.key === 'Shift' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightShift = true;
      if (event.key === 'Control' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftCtrl = true;
      if (event.key === 'Control' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightCtrl = true;
    });

    this.input.keyboard.on('keyup', (event) => {
      if (event.key === 'Shift' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftShift = false;
      if (event.key === 'Shift' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightShift = false;
      if (event.key === 'Control' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftCtrl = false;
      if (event.key === 'Control' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightCtrl = false;
    });

    // Create virtual key objects for jump/shoot
    this.p1Keys.jump = { isDown: false };
    this.p1Keys.shoot = { isDown: false };
    this.p2Keys.jump = { isDown: false };
    this.p2Keys.shoot = { isDown: false };

    // Weapon switching
    this.p1Keys.weaponPrev.on('down', () => this.gameState.player1.switchWeapon(-1));
    this.p1Keys.weaponNext.on('down', () => this.gameState.player1.switchWeapon(1));
    this.p2Keys.weaponPrev.on('down', () => this.gameState.player2.switchWeapon(-1));
    this.p2Keys.weaponNext.on('down', () => this.gameState.player2.switchWeapon(1));

    // Prevent browser default for game keys
    this.input.keyboard.addCapture(['W','A','S','D','Q','E','UP','DOWN','LEFT','RIGHT','SHIFT','CTRL','COMMA','PERIOD','ENTER']);
  }

  update(time, delta) {
    // Sync raw keys to virtual key objects
    this.p1Keys.jump.isDown = this.rawKeys.leftShift;
    this.p1Keys.shoot.isDown = this.rawKeys.leftCtrl;
    this.p2Keys.jump.isDown = this.rawKeys.rightShift;
    this.p2Keys.shoot.isDown = this.rawKeys.rightCtrl;

    // Player input
    this.player1.handleInput(this.p1Keys, delta);
    this.player2.handleInput(this.p2Keys, delta);

    // Update visuals
    this.player1.updateVisuals();
    this.player2.updateVisuals();

    // Camera follows midpoint between players
    const midX = (this.player1.x + this.player2.x) / 2;
    const midY = (this.player1.y + this.player2.y) / 2;
    this.cameras.main.centerOn(midX, midY);
  }
}
```

- [ ] **Step 3: Run dev server and verify player movement**

```bash
npm run dev
```

Expected: Two pixelated characters spawn on opposite sides of the arena. P1 moves with WASD, P2 with arrow keys. Both can jump (Shift). Aim line rotates with W/S and Up/Down. Camera follows the midpoint. Players collide with ground and obstacles.

- [ ] **Step 4: Commit**

```bash
git add src/entities/Player.js src/scenes/GameScene.js
git commit -m "add player movement, jumping, and aim"
```

---

### Task 10: Shooting — Bullets and Damage

**Files:**
- Create: `src/entities/Bullet.js`
- Modify: `src/scenes/GameScene.js`

- [ ] **Step 1: Create Bullet entity**

```js
// src/entities/Bullet.js
import Phaser from 'phaser';
import { WEAPONS } from '../config/weapons.js';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, angle, facing, weaponKey, shooterId) {
    super(scene, x, y, 'bullet');
    this.weaponKey = weaponKey;
    this.shooterId = shooterId;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);

    const weapon = WEAPONS[weaponKey];
    const vx = Math.cos(angle) * weapon.bulletSpeed * facing;
    const vy = Math.sin(angle) * weapon.bulletSpeed;
    this.setVelocity(vx, vy);

    // Rotate sprite to match direction
    this.setRotation(Math.atan2(vy, vx));

    // Destroy after 3 seconds if it hasn't hit anything
    scene.time.delayedCall(3000, () => {
      if (this.active) this.destroy();
    });
  }

  getDamage(isHeadshot) {
    const weapon = WEAPONS[this.weaponKey];
    return isHeadshot ? weapon.headshotDamage : weapon.damage;
  }
}
```

- [ ] **Step 2: Add shooting and bullet collision to GameScene**

Add these methods to `GameScene`:

```js
// Add to GameScene.create(), after weapon switching section:

    // Bullet group
    this.bullets = this.add.group();

    // Track last fire time per player
    this.lastFireTime = { 1: 0, 2: 0 };

// Add to GameScene.update(), after player input section:

    // Shooting
    this.handleShooting(this.player1, this.p1Keys, time);
    this.handleShooting(this.player2, this.p2Keys, time);

    // Bullet vs player collisions
    this.physics.overlap(this.bullets, this.player1, (bullet, player) => {
      if (bullet.shooterId === player.playerState.id) return;
      this.hitPlayer(bullet, player);
    });
    this.physics.overlap(this.bullets, this.player2, (bullet, player) => {
      if (bullet.shooterId === player.playerState.id) return;
      this.hitPlayer(bullet, player);
    });

    // Bullet vs obstacle collisions
    this.physics.overlap(this.bullets, this.obstacleGroup, (bullet, obstacle) => {
      const damage = WEAPONS[bullet.weaponKey].damage;
      if (obstacle.takeDamage) obstacle.takeDamage(damage);
      bullet.destroy();
    });
```

Add these new methods to `GameScene`:

```js
  handleShooting(playerEntity, keys, time) {
    const state = playerEntity.playerState;
    const weapon = WEAPONS[state.currentWeapon];
    const canFire = time - state.lastFireTime >= weapon.fireRate;

    if (keys.shoot.isDown && canFire) {
      if (!weapon.auto && state.lastFireTime > 0 && keys.shoot._justPressed === false) {
        return; // Non-auto weapons need key release between shots
      }

      state.lastFireTime = time;
      const spawnX = playerEntity.x + playerEntity.facing * 16;
      const spawnY = playerEntity.y - 8;

      if (weapon.chargeDelay > 0) {
        // Sniper has charge delay
        this.time.delayedCall(weapon.chargeDelay, () => {
          if (playerEntity.active) {
            this.spawnBullet(spawnX, spawnY, state.aimAngle, playerEntity.facing, state.currentWeapon, state.id);
          }
        });
      } else {
        this.spawnBullet(spawnX, spawnY, state.aimAngle, playerEntity.facing, state.currentWeapon, state.id);
      }
    }
  }

  spawnBullet(x, y, angle, facing, weaponKey, shooterId) {
    const bullet = new Bullet(this, x, y, angle, facing, weaponKey, shooterId);
    this.bullets.add(bullet);
  }

  hitPlayer(bullet, playerEntity) {
    const state = playerEntity.playerState;

    // Headshot detection: upper 25% of sprite
    const headThreshold = playerEntity.y - playerEntity.height * 0.25;
    const isHeadshot = bullet.y < headThreshold;

    const damage = bullet.getDamage(isHeadshot);
    state.takeDamage(damage, isHeadshot);
    bullet.destroy();

    // Flash player on hit
    playerEntity.setTint(0xffffff);
    this.time.delayedCall(100, () => {
      if (playerEntity.active) playerEntity.clearTint();
    });

    // Check for death
    if (state.isDead()) {
      this.handlePlayerDeath(state.id);
    }
  }

  handlePlayerDeath(deadPlayerId) {
    const winnerIndex = deadPlayerId === 1 ? 1 : 0;
    this.gameState.winRound(winnerIndex);

    // Cleanup
    this.player1.cleanup();
    this.player2.cleanup();

    const matchWinner = this.gameState.getMatchWinner();
    if (matchWinner !== null) {
      this.scene.start('GameOver', {
        winner: matchWinner + 1,
        scores: [...this.gameState.scores],
        bestOf: this.bestOf,
      });
    } else {
      this.scene.start('RoundEnd', {
        roundWinner: winnerIndex + 1,
        scores: [...this.gameState.scores],
        bestOf: this.bestOf,
        gameState: this.gameState,
      });
    }
  }
```

Also add the Bullet import at the top:
```js
import { Bullet } from '../entities/Bullet.js';
import { WEAPONS } from '../config/weapons.js';
```

- [ ] **Step 3: Run dev server and verify shooting**

```bash
npm run dev
```

Expected: Players can shoot bullets with Ctrl. Bullets fly in the aimed direction. Hitting the other player reduces their HP (visible in health bar). Hitting obstacles damages/destroys them. When a player dies, scene transitions to RoundEnd or GameOver.

- [ ] **Step 4: Commit**

```bash
git add src/entities/Bullet.js src/scenes/GameScene.js
git commit -m "add shooting, bullet collisions, and damage"
```

---

### Task 11: HUD — Weapon and Health Display

**Files:**
- Create: `src/ui/HUD.js`
- Modify: `src/scenes/GameScene.js`

- [ ] **Step 1: Create HUD**

```js
// src/ui/HUD.js
import { WEAPONS } from '../config/weapons.js';

export class HUD {
  constructor(scene) {
    this.scene = scene;

    // P1 HUD (top left)
    this.p1Name = scene.add.text(15, 10, 'PLAYER 1', {
      fontSize: '14px',
      fill: '#4fc3f7',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(100);

    this.p1HealthBg = scene.add.rectangle(15, 32, 120, 10, 0x333333)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.p1HealthFill = scene.add.rectangle(15, 32, 120, 10, 0x4caf50)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);

    this.p1Weapon = scene.add.text(15, 48, '', {
      fontSize: '11px',
      fill: '#ff9800',
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);

    // P2 HUD (top right)
    this.p2Name = scene.add.text(785, 10, 'PLAYER 2', {
      fontSize: '14px',
      fill: '#ef5350',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.p2HealthBg = scene.add.rectangle(665, 32, 120, 10, 0x333333)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.p2HealthFill = scene.add.rectangle(665, 32, 120, 10, 0xf44336)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);

    this.p2Weapon = scene.add.text(785, 48, '', {
      fontSize: '11px',
      fill: '#ff9800',
      fontFamily: 'monospace',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Round info (top center)
    this.roundText = scene.add.text(400, 10, '', {
      fontSize: '14px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
  }

  update(gameState) {
    const p1 = gameState.player1;
    const p2 = gameState.player2;

    // Health bars
    this.p1HealthFill.setDisplaySize(120 * (p1.hp / 100), 10);
    this.p2HealthFill.setDisplaySize(120 * (p2.hp / 100), 10);

    // Health bar colors
    const p1Ratio = p1.hp / 100;
    const p2Ratio = p2.hp / 100;
    this.p1HealthFill.setFillStyle(p1Ratio > 0.5 ? 0x4caf50 : p1Ratio > 0.25 ? 0xff9800 : 0xf44336);
    this.p2HealthFill.setFillStyle(p2Ratio > 0.5 ? 0x4caf50 : p2Ratio > 0.25 ? 0xff9800 : 0xf44336);

    // Weapon names
    this.p1Weapon.setText(WEAPONS[p1.currentWeapon].name);
    this.p2Weapon.setText(WEAPONS[p2.currentWeapon].name);

    // Round info
    this.roundText.setText(
      `Round ${gameState.currentRound}  |  ${gameState.scores[0]} - ${gameState.scores[1]}`
    );
  }
}
```

- [ ] **Step 2: Add HUD to GameScene**

In `GameScene.create()`, after all existing setup:
```js
    // HUD
    this.hud = new HUD(this);
```

In `GameScene.update()`, after camera centering:
```js
    // Update HUD
    this.hud.update(this.gameState);
```

Add import:
```js
import { HUD } from '../ui/HUD.js';
```

- [ ] **Step 3: Run dev server and verify HUD**

```bash
npm run dev
```

Expected: Top-left shows P1 name, health bar, weapon name. Top-right shows same for P2. Center shows round number and score. All update in real-time as players take damage and switch weapons.

- [ ] **Step 4: Commit**

```bash
git add src/ui/HUD.js src/scenes/GameScene.js
git commit -m "add HUD with health, weapon, and round display"
```

---

### Task 12: RoundEndScene and GameOverScene

**Files:**
- Modify: `src/scenes/RoundEndScene.js`
- Modify: `src/scenes/GameOverScene.js`

- [ ] **Step 1: Implement RoundEndScene**

```js
// src/scenes/RoundEndScene.js
import Phaser from 'phaser';

export class RoundEndScene extends Phaser.Scene {
  constructor() {
    super('RoundEnd');
  }

  init(data) {
    this.roundWinner = data.roundWinner;
    this.scores = data.scores;
    this.bestOf = data.bestOf;
    this.gameState = data.gameState;
  }

  create() {
    const centerX = 400;
    const winnerColor = this.roundWinner === 1 ? '#4fc3f7' : '#ef5350';

    this.add.text(centerX, 200, `Player ${this.roundWinner} wins the round!`, {
      fontSize: '36px',
      fill: winnerColor,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(centerX, 280, `${this.scores[0]}  -  ${this.scores[1]}`, {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Countdown
    this.countdown = 3;
    this.countdownText = this.add.text(centerX, 380, `Next round in ${this.countdown}...`, {
      fontSize: '20px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      repeat: 2,
      callback: () => {
        this.countdown--;
        if (this.countdown > 0) {
          this.countdownText.setText(`Next round in ${this.countdown}...`);
        } else {
          this.gameState.resetRound();
          this.scene.start('Game', { bestOf: this.bestOf, gameState: this.gameState });
        }
      },
    });
  }
}
```

- [ ] **Step 2: Update GameScene to accept existing gameState**

In `GameScene.init()`:
```js
  init(data) {
    this.bestOf = data.bestOf || 3;
    this.existingGameState = data.gameState || null;
  }
```

In `GameScene.create()`, replace the gameState line:
```js
    this.gameState = this.existingGameState || new GameState(this.bestOf);
    this.existingGameState = null;
```

- [ ] **Step 3: Implement GameOverScene**

```js
// src/scenes/GameOverScene.js
import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.winner = data.winner;
    this.scores = data.scores;
    this.bestOf = data.bestOf;
  }

  create() {
    const centerX = 400;
    const winnerColor = this.winner === 1 ? '#4fc3f7' : '#ef5350';

    this.add.text(centerX, 180, `Player ${this.winner} wins!`, {
      fontSize: '48px',
      fill: winnerColor,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(centerX, 260, `${this.scores[0]}  -  ${this.scores[1]}`, {
      fontSize: '36px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 340, `Best of ${this.bestOf}`, {
      fontSize: '18px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 440, 'Press ENTER to play again', {
      fontSize: '22px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 490, 'Press ESC for menu', {
      fontSize: '16px',
      fill: '#666666',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Game', { bestOf: this.bestOf });
    });

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('Menu');
    });
  }
}
```

- [ ] **Step 4: Run dev server and verify full game loop**

```bash
npm run dev
```

Expected: Full game loop works — Menu → Game → RoundEnd (with countdown) → Game → ... → GameOver → Menu or restart. Scores track correctly across rounds.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/RoundEndScene.js src/scenes/GameOverScene.js src/scenes/GameScene.js
git commit -m "add round end and game over scenes with full game loop"
```

---

### Task 13: Polish — Auto-fire, Sniper Laser, Camera Zoom

**Files:**
- Modify: `src/scenes/GameScene.js`
- Modify: `src/entities/Player.js`

- [ ] **Step 1: Fix auto-fire for assault rifle**

In `GameScene.handleShooting()`, replace the non-auto check:

```js
  handleShooting(playerEntity, keys, time) {
    const state = playerEntity.playerState;
    const weapon = WEAPONS[state.currentWeapon];
    const canFire = time - state.lastFireTime >= weapon.fireRate;

    if (keys.shoot.isDown && canFire) {
      state.lastFireTime = time;
      const spawnX = playerEntity.x + playerEntity.facing * 16;
      const spawnY = playerEntity.y - 8;

      if (weapon.chargeDelay > 0) {
        this.time.delayedCall(weapon.chargeDelay, () => {
          if (playerEntity.active) {
            this.spawnBullet(spawnX, spawnY, state.aimAngle, playerEntity.facing, state.currentWeapon, state.id);
          }
        });
      } else {
        this.spawnBullet(spawnX, spawnY, state.aimAngle, playerEntity.facing, state.currentWeapon, state.id);
      }
    }
  }
```

- [ ] **Step 2: Add sniper laser sight to Player**

In `Player.drawAimLine()`, extend the laser for sniper:

```js
  drawAimLine() {
    this.aimLine.clear();
    const angle = this.playerState.aimAngle;
    const startX = this.x + this.facing * 12;
    const startY = this.y - 8;

    const weapon = WEAPONS[this.playerState.currentWeapon];

    if (weapon.laser) {
      // Sniper laser — long red line
      const length = 500;
      const endX = startX + Math.cos(angle) * length * this.facing;
      const endY = startY + Math.sin(angle) * length;
      this.aimLine.lineStyle(1, 0xff0000, 0.6);
      this.aimLine.lineBetween(startX, startY, endX, endY);
    } else {
      // Normal aim indicator — short white line
      const length = 40;
      const endX = startX + Math.cos(angle) * length * this.facing;
      const endY = startY + Math.sin(angle) * length;
      this.aimLine.lineStyle(1, 0xffffff, 0.3);
      this.aimLine.lineBetween(startX, startY, endX, endY);
    }
  }
```

- [ ] **Step 3: Add camera zoom based on player distance**

In `GameScene.update()`, replace the camera centering:

```js
    // Camera follows midpoint, zooms based on distance
    const midX = (this.player1.x + this.player2.x) / 2;
    const midY = (this.player1.y + this.player2.y) / 2;
    this.cameras.main.centerOn(midX, midY);

    const dist = Phaser.Math.Distance.Between(
      this.player1.x, this.player1.y,
      this.player2.x, this.player2.y
    );
    const zoom = Phaser.Math.Clamp(800 / Math.max(dist, 400), 0.5, 1.2);
    this.cameras.main.setZoom(Phaser.Math.Linear(this.cameras.main.zoom, zoom, 0.05));
```

- [ ] **Step 4: Run dev server and verify polish**

```bash
npm run dev
```

Expected: Assault rifle fires automatically when holding Ctrl. Sniper shows long red laser sight. Camera smoothly zooms out when players are far apart and zooms in when close.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/GameScene.js src/entities/Player.js
git commit -m "add auto-fire, sniper laser, and dynamic camera zoom"
```

---

### Task 14: Final Integration Test

- [ ] **Step 1: Run all unit tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Manual playtest checklist**

Run `npm run dev` and verify:

1. Menu loads with title, best-of selector works
2. ENTER starts game, arena has ground + obstacles
3. P1 moves with WASD, jumps with left Shift
4. P2 moves with arrows, jumps with right Shift
5. Both players can aim with W/S and Up/Down
6. Weapon switching works (Q/E and ,/.)
7. Shooting works for all three weapons
8. Assault rifle auto-fires when holding Ctrl
9. Sniper has visible laser and charge delay
10. Bullets damage players and obstacles
11. Obstacles break when HP reaches 0 (except platforms)
12. Player death triggers round end with correct winner
13. Score tracks correctly across rounds
14. Match ends with GameOver screen after enough round wins
15. Play Again and ESC work from GameOver
16. Camera follows midpoint and zooms dynamically

- [ ] **Step 3: Commit any fixes from playtesting**

```bash
git add -A
git commit -m "fix issues found during playtesting"
```

(Only if fixes were needed)
