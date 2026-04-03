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
