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
