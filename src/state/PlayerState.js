// src/state/PlayerState.js
import { WEAPON_ORDER } from '../config/weapons.js';

export class PlayerState {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.weaponIndex = 0;
    this.aimAngle = 0;
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
