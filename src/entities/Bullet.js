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
