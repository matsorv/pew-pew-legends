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
