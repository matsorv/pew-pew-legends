const OBSTACLE_DEFS = {
  crate: { width: 48, height: 40, hp: 50 },
  wall: { width: 24, height: 80, hp: 150 },
  platform: { width: 96, height: 16, hp: Infinity },
};

const GROUND_Y = 620;

export class ArenaGenerator {
  static generate(arenaWidth) {
    const spawnMargin = 300;
    const playAreaStart = spawnMargin;
    const playAreaEnd = arenaWidth - spawnMargin;
    const obstacles = [];

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

    const platCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < platCount; i++) {
      const def = OBSTACLE_DEFS.platform;
      const x = playAreaStart + Math.random() * (playAreaEnd - playAreaStart - def.width);
      const y = GROUND_Y - 120 - Math.random() * 100;
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
