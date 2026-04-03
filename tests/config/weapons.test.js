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
