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
